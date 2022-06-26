import { Composition, Predicate, RecursiveArrayOfPredicates, RulesCache } from "../strategyResolver.types";

export default function defaultFilter<T>(data: Composition<T>, callHook) {
  const cache = new Map();
  const results = [];

  for (let i = 0; i < data.length; i++) {
    if (!defaultChecker(callHook, (data[i].ruleset), cache)) continue;
    if (data[i].important) {
      return [callHook("important", data[i])]
    }
    results.push(data[i])
  }

  return results
}

export function defaultChecker (callHook, ruleset: RecursiveArrayOfPredicates, cache: RulesCache) {
  if (isNestedArray(ruleset)) return checkArrayOfRulesets(callHook, ruleset as RecursiveArrayOfPredicates, cache);
  return checkRuleset(callHook, ruleset as Predicate[], cache);
}

export function checkArrayOfRulesets(callHook, rulesetArr: RecursiveArrayOfPredicates, cache: RulesCache): boolean {
  return rulesetArr.some((ruleset) => defaultChecker(callHook, ruleset as RecursiveArrayOfPredicates, cache));
}

export function checkRuleset(callHook, ruleset: Predicate[], cache: RulesCache): boolean {
  return ruleset.every((rule) => {
    const cached = cache.get(rule);
    if (typeof cached === "boolean") return cached;
    const result = callHook("ruleCheck", rule());
    cache.set(rule, result);
    return result;
  });
}

export function isNestedArray(arr: Array<any>): boolean {
  return Array.isArray(arr[0])
}
