import { Composition } from "../src/compositor.types";
import Compositor from "../src/compositor";

const c = new Compositor();

describe("Смешанные композиции", () => {
  test("При наличии data и callback последний в приоритете (Добавление data и callback в один объект является плохой практикой, т.к. data никогда не вернется)", ()=> {
    const callback = jest.fn(() => 42);
    const data: Composition<number> = [
      // @ts-ignore
      {
        ruleset: [() => true],
        callback,
        data: 1
      },
    ]
    expect(c.resolve(data)).toBe(42);
    expect(callback.mock.calls.length).toBe(1);
  })

  test("Допускается использовать data и callback объекты в одной композиции. Возвращается data или результат callback", () => {
    const callback = jest.fn(() => 42);
    const data: Composition<number> = [
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
    const secondData: Composition<number> = [
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
    const data: Composition<number | string> = [
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
    const mock42 = jest.fn(() => 42)
    const data: Composition<number | string | boolean> = [
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
      // @ts-ignore
      {
        ruleset: [() => true],
        callback: mock42,
        data: "Это поле здесь недопустимо, ругается TS"
      }
    ]
    expect(c.resolve(data)).toBe(42);
  })
})
