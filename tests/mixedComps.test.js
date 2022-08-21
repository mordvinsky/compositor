import StrategyResolver from "/src/strategyResolver";

const c = new StrategyResolver();

describe("Смешанные композиции", () => {
  test("При наличии data и callback последний в приоритете. Data передается в callback", ()=> {
    const callback = jest.fn((arg) => arg);
    const data = [
      {
        ruleset: [() => true],
        callback,
        data: 42
      },
    ]
    expect(c.resolve(data)).toBe(42);
    expect(callback.mock.calls.length).toBe(1);
  })

  test("Допускается использовать data и callback объекты в одной композиции. Возвращается data или результат callback", () => {
    const callback = jest.fn(() => 42);
    const data = [
      {
        ruleset: [() => true],
        callback,
      },
      {
        ruleset: [() => true],
        data: 13,
      },
    ]
    expect(c.resolve(data)).toBe(13);
    expect(callback.mock.calls.length).toBe(0);

    const shouldBeFired = jest.fn(() => 42);
    const secondData = [
      {
        ruleset: [() => true],
        data: 1,
      },
      {
        ruleset: [() => true],
        callback: shouldBeFired,
      },
    ]
    expect(c.resolve(secondData)).toBe(42);
    expect(shouldBeFired.mock.calls.length).toBe(1);
  })

  test("Допускается смешивать возвращаемые типы композиций (Но лучше так не делать)", () => {
    const data = [
      {
        ruleset: [() => true],
        data: 1,
      },
      {
        ruleset: [() => true],
        data: "str",
      },
    ]
    expect(c.resolve(data)).toBe("str");
  })

  test("Допускается смешивать возвращаемые типы композиций, использовать data и callback в одной композиции, и даже в одном объекте (very bad practice)", () => {
    const mock = jest.fn((arg) => arg)
    const data = [
      {
        ruleset: [() => true],
        data: 404,
      },
      {
        ruleset: [() => true],
        data: "str",
      },
      {
        ruleset: [() => true],
        callback: () => true
      },
      {
        ruleset: [() => true],
        callback: mock,
        data: 42
      }
    ]
    expect(c.resolve(data)).toBe(42);
  })
})
