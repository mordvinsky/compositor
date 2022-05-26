export type IncludesDataComposition<T> = Includes<CompositionDataObject<T>>
export type IncludesCallableComposition<T> = Includes<CompositionCallableObject<T>>
export type IncludesComposition<T> = Includes<Composition<T>>

export type Composition<T> = CompositionObject<T>[]

export type CompositionObject<T> = CompositionCallableObject<T> | CompositionDataObject<T>

export type CompositionCallableObject<T> = {
  ruleset: RecursiveArrayOfPredicates;
  important?: boolean;
  weight?: number;
  callback: () => T;
  data?: never;
}

export type CompositionDataObject<T> = {
  ruleset: RecursiveArrayOfPredicates;
  important?: boolean;
  weight?: number;
  data: T;
  callback?: never;
}

export type Predicate = () => boolean;

export type RecursiveArrayOfPredicates = Predicate[] | RecursiveArrayOfPredicates[];

export type Includes<T> = T | {[key: string]: T | Includes<T>}
