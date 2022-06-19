import StrategyResolver from "../src/strategyResolver";

const c = new StrategyResolver();

const truthy = () => true;

const data = [
  {
    ruleset: [truthy],
    data: 42
  },
]

describe("Создается объект дебага", () => {
  test("Выводит в консоль", () => {
    c.resolve(c.createDebugComp(data))
  })

  test("Шорткат на резолв", () => {
    c.resolve_debug(data)
  })
})
