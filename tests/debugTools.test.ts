import Compositor from "../src/compositor";

const c = new Compositor();

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

  test("Шорткат на резолв", () => {
    c.resolveFrom_debug("key", {key: data})
  })
})
