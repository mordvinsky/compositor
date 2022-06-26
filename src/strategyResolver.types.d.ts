export type Composition<T> = Strategy<T>[]
export type DataComposition<T> = DataStrategy<T>[]
export type CallableComposition<T> = CallableStrategy<T>[]

export type Strategy<T> = CallableStrategy<T> | DataStrategy<T> | MixedStrategy<T>

export type CallableStrategy<T> = {
  ruleset: RecursiveArrayOfPredicates;
  important?: boolean;
  weight?: number;
  callback: () => T;
  data?: never;
}

export type DataStrategy<T> = {
  ruleset: RecursiveArrayOfPredicates;
  important?: boolean;
  weight?: number;
  data: T;
  callback?: never;
}

export type MixedStrategy<T> = {
  ruleset: RecursiveArrayOfPredicates;
  important?: boolean;
  weight?: number;
  data: T;
  callback?: (data: T) => any;
}

export type Predicate = () => boolean;

export type RecursiveArrayOfPredicates = Predicate[] | RecursiveArrayOfPredicates[];

export type RulesCache = Map<Predicate, boolean>

export type StrategyResolverConfiguration<I, BeforeFilterData, Filtered, BeforeReduce, Reduced, BeforeResolve, Resolve, AfterResolve, Return> = {
  data?: I[];

  filter?: ChainLink<BeforeFilterData, Filtered>
  reducer?: ChainLink<BeforeReduce, Reduced>
  resolver?: ChainLink<BeforeResolve, Resolve>;

  hooks: {
    beforeFilter: ChainLink<I[], BeforeFilterData>
    beforeReduce: ChainLink<Filtered, BeforeReduce>
    beforeResolve: ChainLink<Reduced, BeforeResolve>
    afterResolve: ChainLink<AfterResolve, Return>
    [k: string]: ProxyFn<any>
  }

  debug: boolean
}

export type ChainLink<In, Out> = (arg: In) => Out
export type ProxyFn<T extends any> = (arg: T) => T
