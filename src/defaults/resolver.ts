import { Strategy } from "../strategyResolver.types";

export default function defaultResolver<T> (strategy: Strategy<T>) {
  if (isCallableStrategy(strategy)) {
    return strategy.callback(strategy.data)
  }
  return strategy.data;
}

const isCallableStrategy = (strategy: Strategy<any>): boolean => typeof strategy.callback === "function"
