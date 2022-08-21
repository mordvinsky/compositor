<<<<<<<< HEAD:example/nestedRulesets.explained.test.ts
import StrategyResolver from "../../src/strategyResolver";
========
import StrategyResolver from "../src/strategyResolver";
>>>>>>>> refactor/v2general:example/nestedRulesets.explained.test.js

const c = new StrategyResolver()

describe("Вложенные ruleset", () => {
  test("Вложеннные массивы ruleset работают как логическое ИЛИ", () => {
    const truthy = jest.fn(() => true);
    const falsy = jest.fn(() => false);

    const data = [
      {
        ruleset: [ /* IF */
          [truthy, /* AND */ falsy, /* AND */ truthy], // OR
          [truthy, falsy, truthy],   // OR
          [truthy, truthy],
        ],
        data: 42
      },
    ]

    expect(c.resolve(data)).toBe(42)
  })
})
