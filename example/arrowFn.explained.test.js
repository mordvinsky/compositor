<<<<<<<< HEAD:example/arrowFn.explained.test.ts
import StrategyResolver from "../../src/strategyResolver";
import { CallableComposition } from "../../src/strategyResolver.types";
========
import StrategyResolver from "../src/strategyResolver";
>>>>>>>> refactor/v2general:example/arrowFn.explained.test.js

const c = new StrategyResolver()

describe("Работа со стрелочными функциями, кэширование", () => {
  test("Плохой пример", () => {
    const expensiveComputations = jest.fn(() => true)
    const data = [
      {
        ruleset: [() => expensiveComputations()], // Это две РАЗНЫЕ функции, делающие одно и то же.
        callback: () => 42
      },
      {
        ruleset: [() => expensiveComputations()], // Это две РАЗНЫЕ функции, делающие одно и то же.
        callback: () => 42
      }
    ]

    expect(c.resolve(data)).toBe(42);
    expect(expensiveComputations.mock.calls.length).toBe(2)
  })

  test("Правильный пример", () => {
    const expensiveComputations = jest.fn(() => true)
    const data = [
      {
        ruleset: [expensiveComputations],
        callback: () => 42
      },
      {
        ruleset: [expensiveComputations], // Теперь ок, одна и та же функция указана дважды
        callback: () => 42
      }
    ]

    expect(c.resolve(data)).toBe(42);
    expect(expensiveComputations.mock.calls.length).toBe(1)
  })
})
