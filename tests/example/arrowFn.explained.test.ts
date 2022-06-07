import Compositor from "../../src/compositor";
import { CallableComposition } from "../../src/compositor.types";

const c = new Compositor()

describe("Работа со стрелочными функциями, кэширование", () => {
  test("Плохой пример", () => {
    const expensiveComputations = jest.fn(() => true)
    const data: CallableComposition<number> = [
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
    const data: CallableComposition<number> = [
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
