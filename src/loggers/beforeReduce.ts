export default function(rulesPassed) {
  console.groupEnd();
  console.groupCollapsed(`Passed variants: ${rulesPassed.length}`);
    console.table(rulesPassed);
  console.groupEnd();
}
