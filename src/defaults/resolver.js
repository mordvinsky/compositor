export default function defaultResolver (strategy, callHook) {
  if (isCallableStrategy(strategy)) {
    return strategy.callback(callHook("beforeStrategyCall", strategy.data))
  }
  return strategy.data;
}

const isCallableStrategy = (strategy) => typeof strategy.callback === "function"
