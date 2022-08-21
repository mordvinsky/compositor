import StrategyResolver from "/src/strategyResolver";

const c = new StrategyResolver()

describe("Общий функционал", () => {
  test('Testing is possible', () => {
    expect(c).toBeTruthy();
  });

  test("По умолчанию возвращается последний прошедший проверку элемент", () => {
    const data = [
      {
        ruleset: [() => true],
        data: 1
      },
      {
        ruleset: [() => true],
        data: 2
      },
      {
        ruleset: [() => false],
        data: 3
      }
    ]
    expect(c.resolve(data)).toBe(2)
  })

  test("При наличии веса возвращается дата из объекта с наибольшим весом", () => {
    const data = [
      {
        ruleset: [() => true],
        weight: -1,
        data: 1
      },
      {
        ruleset: [() => true],
        weight: 1,
        data: 2
      },
      {
        ruleset: [() => true],
        weight: 0,
        data: 3
      }
    ]
    expect(c.resolve(data)).toBe(2)
  })
  test("Вес по умолчанию - 0", () => {
    const data = [
      {
        ruleset: [() => true],
        weight: 0,
        data: 1
      },
      {
        ruleset: [() => true],
        data: 2
      }
    ]
    expect(c.resolve(data)).toBe(2)
  })
  test("При наличии important и прохождении проверки выполнение проверки прерывается, возвращается дата из этого объекта", () => {
    const rule = jest.fn(() => true);
    const shouldNotBeFired = jest.fn(() => true);

    const data = [
      {
        ruleset: [rule],
        weight: 1,
        important: false, //Можно не указывать, по умолчанию false
        data: 1
      },
      {
        ruleset: [rule],
        weight: -900,
        important: true,
        data: 2
      },
      {
        ruleset: [shouldNotBeFired],
        weight: 999,
        data: 3
      }
    ]
    expect(c.resolve(data)).toBe(2)
    expect(shouldNotBeFired.mock.calls.length).toBe(0);
  })

  test("Вызовы правил из Ruleset кэшируются", () =>{
    const rule = jest.fn(() => true);
    const shouldBeFired = jest.fn(() => true);

    const data = [
      {
        ruleset: [rule],
        data: 1
      },
      {
        ruleset: [rule],
        data: 2
      },
      {
        ruleset: [rule],
        data: 3
      },
      {
        ruleset: [shouldBeFired],
        data: 4
      },
    ]
    expect(c.resolve(data)).toBe(4)
    expect(shouldBeFired.mock.calls.length).toBe(1)
    expect(rule.mock.calls.length).toBe(1)
  })
})

describe("Композиции c Callback-полем", () => {
  test(`Если есть callback, он вызывается для итогового объекта. Аргументом передается data`, () => {
    const rule = jest.fn(() => true);
    const callback = jest.fn(() => 0);
    const resultCallback = jest.fn((arg) => arg);

    const data = [
      {
        ruleset: [rule],
        callback,
      },
      {
        ruleset: [rule],
        callback,
      },
      {
        ruleset: [rule],
        data: 42,
        callback: resultCallback,
      },
    ]
    expect(c.resolve(data)).toBe(42);
    expect(callback.mock.calls.length).toBe(0);
    expect(resultCallback.mock.calls.length).toBe(1);
  })
})
