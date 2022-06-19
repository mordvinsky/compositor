import { Composition } from "../strategyResolver.types";

export default function defaultFilter<T>(data: Composition<T>, hook, checker) {
  const cache = new Map();
  const results = [];

  for (let i = 0; i < data.length; i++) {
    if (!checker(hook, (data[i].ruleset), cache)) continue;
    if (data[i].important) return [data[i]]
    results.push(data[i])
  }

  return results
}
