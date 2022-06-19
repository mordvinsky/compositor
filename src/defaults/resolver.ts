import { Strategy } from "../strategyResolver.types";

export default function defaultResolver<T> (strategy: Strategy<T>) {
  if (strategy.callback) return strategy.callback()
  return strategy.data;
}
