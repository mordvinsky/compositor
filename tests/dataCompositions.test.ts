import Compositor from "../src/compositor";
import { DataComposition } from "../src/compositor.types";

const c = new Compositor()

describe("Data Compositions", () => {
  test('Testing is possible', () => {
    expect(c).toBeTruthy();
  });

  test("По умолчанию возвращается последний прошедший проверку элемент", () => {
    const stringDataComp: DataComposition<number> = [
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
    expect(c.resolve(stringDataComp)).toBe(2)
  })

  test("При наличии веса возвращается дата из объекта с наибольшим весом", () => {
    const stringDataComp: DataComposition<number> = [
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
    expect(c.resolve(stringDataComp)).toBe(2)
  })
  test("При наличии important и прохождении проверки выполнение прерывается, возвращается дата из этого объекта", () => {
    const rule = jest.fn(() => true);
    const shouldNotBeFired = jest.fn(() => true);

    const stringDataComp: DataComposition<number> = [
      {
        ruleset: [rule],
        weight: -1,
        important: false,
        data: 1
      },
      {
        ruleset: [rule],
        weight: 1,
        important: true,
        data: 2
      },
      {
        ruleset: [shouldNotBeFired],
        weight: 999,
        data: 3
      }
    ]
    expect(c.resolve(stringDataComp)).toBe(2)
    expect(shouldNotBeFired.mock.calls.length).toBe(0);
  })

  test("Вызовы правил из Ruleset кэшируются", () =>{
    const rule = jest.fn(() => true);

    const stringDataComp: DataComposition<number> = [
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
      }
    ]
    expect(c.resolve(stringDataComp)).toBe(3)
    expect(rule.mock.calls.length).toBe(1)
  })
})


