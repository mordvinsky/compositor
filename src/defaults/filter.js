export default function defaultFilter(data, callHook) {
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

export function defaultChecker (callHook, ruleset, cache) {
  if (isNestedArray(ruleset)) return checkArrayOfRulesets(callHook, ruleset, cache);
  return checkRuleset(callHook, ruleset, cache);
}

export function checkArrayOfRulesets(callHook, rulesetArr, cache) {
  return rulesetArr.some((ruleset) => defaultChecker(callHook, ruleset, cache));
}

export function checkRuleset(callHook, ruleset, cache) {
  return ruleset.every((rule) => {
    const cached = cache.get(rule);
    if (typeof cached === "boolean") return cached;
    const result = callHook("ruleCheck", rule());
    cache.set(rule, result);
    return result;
  });
}

export function isNestedArray(arr) {
  return Array.isArray(arr[0])
}
