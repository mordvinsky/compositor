import { Strategy } from "../strategyResolver.types";

export default function defaultResolver<T> (strategy: Strategy<T>, callHook) {
  if (isCallableStrategy(strategy)) {
    return strategy.callback(callHook("beforeStrategyCall", strategy.data))
  }
  return strategy.data;
}

const isCallableStrategy = (strategy: Strategy<any>): boolean => typeof strategy.callback === "function"
