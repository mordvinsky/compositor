import StrategyResolver from "../src/strategyResolver";

const c = new StrategyResolver();

const truthy = () => true;

const data = [
  {
    ruleset: [truthy],
    weight: Number.NEGATIVE_INFINITY,  // Вариант указания "по-настоящему default" значения.
    data: 42
  },
  {
    ruleset: [truthy],
    weight: -1, // Такое правило все равно приоритетнее default указанного выше
    data: 42
  },
  {
    ruleset: [truthy],
    weight: 0, // Эквивалентно отсутствию веса, можно не указывать такое значение
    data: 42
  },
  {
    ruleset: [truthy],
    weight: 1,
    data: 42
  },
  {
    ruleset: [truthy],
    weight: Number.POSITIVE_INFINITY, // Максимально возможный вес.
    data: 42
  },
  {
    ruleset: [truthy],
    weight: Number.POSITIVE_INFINITY, // Однако это правило все еще важнее, т.к. находится ниже.
    data: 666
  }
]

describe("Пример описывающий работу системы весов", () => {
  test("Веса разрешаются в правильном порядке", () => {
    expect(c.resolve(data)).toBe(666);
  })
})
