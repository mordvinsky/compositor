export default function(data) {
  console.groupCollapsed(
    "%c%s",
    "color:blue",
    `[StrategyResolver]: resolving composition of ${data.length} elements`
  );
    console.groupCollapsed(`All variants: ${data.length}`);
      console.table(data);
    console.groupEnd();

  console.groupCollapsed("Rules check: ");
}
