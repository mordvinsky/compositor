import Compositor from "../../src/compositor";

const c = new Compositor()

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
