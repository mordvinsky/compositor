export default function defaultReducer(arr, callHook)  {
  if (arr[0] === undefined) return callHook("reducerUndefined", undefined);
  let accum = arr[0];

  for (let i = 1; i < arr.length; i++) {
    if (accum.important) return accum;
    if ((arr[i].weight || 0) >= (accum.weight || 0)) {
      accum = arr[i]
    }
  }
  return accum
}
