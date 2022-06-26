import defaultFilter from "./defaults/filter";
import defaultReducer from "./defaults/reducer";
import defaultResolver from "./defaults/resolver";
import loggers from "./loggers";
import assign from "./assign";
import { StrategyResolverConfiguration } from "./strategyResolver.types";

export default class StrategyResolver<I, BeforeFilterData, Filtered, BeforeReduce, Reduced, BeforeResolve, Resolve, AfterResolve, Return> {
  constructor(config: StrategyResolverConfiguration<I, BeforeFilterData, Filtered, BeforeReduce, Reduced, BeforeResolve, Resolve, AfterResolve, Return>) {
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

  async resolveAsync(data = this.data) {
    const $ = this;
    const callHook = $.runHook.bind($)

    return await new Promise(() => data)
      .then(async res => await $.runHookAsync("beforeFilter", res))
      .then(async res => await $.filter(res, callHook))
      .then(async res => await $.runHookAsync("beforeReduce", res))
      .then(async res => await $.reducer(res, callHook))
      .then(async res => await $.runHookAsync("beforeResolve", res))
      .then(async res => await $.resolver(res, callHook))
      .then(async res => await $.runHookAsync("afterResolve", res))
  }

  async runHookAsync(hook, previousStepResult) {
    if (this.debug) loggers[hook](previousStepResult);
    if (!this.useHooks || typeof this.hooks[hook] !== "function") return previousStepResult;
    return await this.hooks[hook](previousStepResult)
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
