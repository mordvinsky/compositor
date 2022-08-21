import defaultFilter from "./defaults/filter";
import defaultReducer from "./defaults/reducer";
import defaultResolver from "./defaults/resolver";
import loggers from "./loggers";
import assign from "./assign";

export default class StrategyResolver {
  constructor(config) {
    this.configure(config)
  }

  resolve(data = this.data) {
    const $ = this;
    const callHook = $.runHook.bind($)

    return this.runInChain(data, [
      (res) => $.runHook("beforeFilter", res),
      (res) => $.filter(res, callHook),
      (res) => $.runHook("beforeReduce", res),
      (res) => $.reducer(res, callHook),
      (res) => $.runHook("beforeResolve", res),
      (res) => $.resolver(res, callHook),
      (res) => $.runHook("afterResolve", res),
    ])
  }

  runHook(hook, previousStepResult) {
    if (this.debug) loggers[hook](previousStepResult);
    if (!this.useHooks || typeof this.hooks[hook] !== "function") return previousStepResult;
    return this.hooks[hook](previousStepResult)
  }

  runInChain(input, arr) {
    return arr.reduce((accum, current) => {
      return current(accum)
    }, input)
  }

  configure({
              data,
              filter = defaultFilter,
              reducer = defaultReducer,
              resolver = defaultResolver,

              hooks = {},

              debug = false,
              useHooks = true,

            } = {}) {
    this.data = data;
    this.filter = assign("filter", filter);
    this.reducer = assign("reducer", reducer);
    this.resolver = assign("resolver", resolver);
    this.hooks = hooks;
    this.useHooks = useHooks;
    this.debug = debug;
  }
}
