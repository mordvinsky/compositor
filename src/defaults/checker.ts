import { Predicate, RecursiveArrayOfPredicates, RulesCache } from "../strategyResolver.types";

export default function defaultChecker (hook, ruleset: RecursiveArrayOfPredicates, cache: RulesCache) {
  if (isNestedArray(ruleset)) return checkArrayOfRulesets(hook, ruleset as RecursiveArrayOfPredicates, cache);
  return checkRuleset(hook, ruleset as Predicate[], cache);
}

export function checkArrayOfRulesets(hook, rulesetArr: RecursiveArrayOfPredicates, cache: RulesCache): boolean {
  return rulesetArr.some((ruleset) => defaultChecker(hook, ruleset as RecursiveArrayOfPredicates, cache));
}

export function checkRuleset(hook, ruleset: Predicate[], cache: RulesCache): boolean {
  return ruleset.every((rule) => {
    const cached = cache.get(rule);
    if (cached === true || cached === false) return cached;
    const result = rule();
    hook(result, rule)
    cache.set(rule, result);
    return result;
  });
}

export function isNestedArray(arr: Array<any>): boolean {
  return Array.isArray(arr[0])
}
