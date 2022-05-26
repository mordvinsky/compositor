import {
  Composition, Includes,
  Predicate,
  RecursiveArrayOfPredicates,
  IncludesComposition, CompositionObject
} from "./compositor.types";

export default class Compositor<X>{
  private data: IncludesComposition<X>;
  constructor(data?: IncludesComposition<X>) {
    this.data = data;
  }

  navigate<T>(route: string | string[], target: Includes<T>): T | null {
    try {
      let path;
      if (typeof route === "string") {
        path = route.split(".")
      } else if (Array.isArray(route)) {
        path = route.reverse()
      } else return null;

      if (typeof target !== "object") return null;

      const _recursive = (root: object, pathArr: (string | number)[]) => {
        // @ts-ignore
        let step = root[pathArr.pop()]
        if (pathArr.length > 0) {
          step = _recursive(step, pathArr)
        }
        return step
      }

      return _recursive(target as object, path);
    } catch ( e ) {
      console.error(e);
      return null;
    }
  }

  public resolveFrom<T>(route: string | string[], target: IncludesComposition<T> = this.data as IncludesComposition<T>): T | null {
    try {
      return this.resolve(this.navigate(route, target))
    } catch (e) {
      return null;
    }
  }

  public resolve<T>(comp: Composition<T>): T | null {
    const candidates = this._getCandidates(comp);
    if (candidates.length === 0) return null;
    let result = null;
    try {
      result = candidates.reduce(
        // @ts-ignore
        (accum: CompositionObject<T>, current: CompositionObject<T>) => {
          if (current.important) throw current;
          if ((current.weight || 0) >= (accum.weight || 0)) {
            return current;
          }
          return accum;
        },
        candidates[0]
      );
    } catch (important) {
      result = important as CompositionObject<T>;
    }
    if (result?.callback) return result.callback();
    return result?.data || null;
  }

  check (ruleset: RecursiveArrayOfPredicates): boolean {
    if (this._isNestedArray(ruleset)) return this._checkArrayOfRulesets(ruleset as RecursiveArrayOfPredicates);
    return this._checkRuleset(ruleset as Predicate[]);
  };

  _getCandidates<T>(dir: Composition<T>): Composition<T> | [] {
  return dir.filter(composition => {
      return this.check(composition.ruleset);
    });
  }

  _checkArrayOfRulesets(rulesetArr: RecursiveArrayOfPredicates): boolean {
    return rulesetArr.some((ruleset) => this.check(ruleset as RecursiveArrayOfPredicates));
  };

  _checkRuleset(ruleset: Predicate[]): boolean {
    return ruleset.every((rule) => {
      return rule();
    });
  };

  _isNestedArray = (arr: any): boolean => Array.isArray(arr[0])
}
