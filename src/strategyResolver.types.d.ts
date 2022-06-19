export type Composition<T> = Strategy<T>[]
export type DataComposition<T> = DataStrategy<T>[]
export type CallableComposition<T> = CallableStrategy<T>[]

export type Strategy<T> = CallableStrategy<T> | DataStrategy<T>

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

export type Predicate = () => boolean;

export type RecursiveArrayOfPredicates = Predicate[] | RecursiveArrayOfPredicates[];

export type RulesCache = Map<Predicate, boolean>

export type StrategyResolverConfiguration<T> = {
  data?: T[];

  filter?: FilterFunction<T[]>;
  checker?: RulesetChecker
  reducer?: Reducer<T>;
  resolver?: Resolver<T>;

  beforeResolve?: any;
  afterResolve?: any;

  beforeEachCompObj?: any;
  afterEachCompObj?: any;

  beforeEachRuleCheck?: any;
  afterEachRuleCheck?: any;

  onResult?: any;

  debug: boolean
}

export type FilterFunction<T extends any> = (arr: T[]) =>  T[] | []
export type DefaultFilterFunction<T> = (arr: T[], checker: RulesetChecker) => T[] | []

export type RulesetChecker = (arr: RecursiveArrayOfPredicates) => boolean
export type DefaultRulesetChecker = (arr: RecursiveArrayOfPredicates, cache: RulesCache) => boolean

export type Reducer<T> = (arr: T[]) => T | undefined
