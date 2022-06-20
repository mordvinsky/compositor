import defaultFilter from "./defaults/filter";
import defaultChecker from "./defaults/checker";
import defaultReducer from "./defaults/reducer";
import defaultResolver from "./defaults/resolver";
import loggers from "./loggers";
import assign from "./assign";

export default class StrategyResolver {
  constructor({
                data,
                filter = defaultFilter,
                checker = defaultChecker,
                reducer = defaultReducer,
                resolver = defaultResolver,

                beforeFilter = null,
                beforeReduce = null,
                beforeResolve = null,
                afterResolve = null,

                onEachRuleCheck = null,

                debug = false,
                useHooks = true,

              } = {}) {
    this.data = data;
    this.filter = assign("filter", filter);
    this.checker = assign("checker", checker);
    this.reducer = assign("reducer", reducer);
    this.resolver = assign("resolver", resolver);
    this.hooks = {
      beforeFilter,
      beforeReduce,
      beforeResolve,
      afterResolve,

      onEachRuleCheck,
    }
    this.useHooks = useHooks;
    this.debug = debug;
    console.log(this)
  }

  resolve(data = this.data) {
    const $ = this;

    return this.runInChain(data, [
      (res) => $.runHook("beforeFilter", res),
      (res) => $.filter(res, $.runHook.bind($, "onEachRuleCheck"), $.checker),
      (res) => $.runHook("beforeReduce", res),
      (res) => $.reducer(res),
      (res) => $.runHook("beforeResolve", res),
      (res) => $.resolver(res),
      (res) => $.runHook("afterResolve", res),
    ])
  }

  async resolveAsync(data = this.data) {
    const $ = this;

    return await new Promise(() => data)
      .then(async res => await $.runHookAsync("beforeFilter", res))
      .then(async res => await $.filter(res, $.runHookAsync.bind($, "onEachRuleCheck"), $.checker))
      .then(async res => await $.runHookAsync("beforeReduce", res))
      .then(async res => await $.reducer(res))
      .then(async res => await $.runHookAsync("beforeResolve", res))
      .then(async res => await $.resolver(res))
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
}
