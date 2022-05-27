import Compositor from "../src/compositor";

const c = new Compositor();

const truthy = () => true;

const data = [
  {
    ruleset: [truthy],
    weight: Number.NEGATIVE_INFINITY,  // Вариант указания "по-настоящему default" значения.
    data: 42
  },
  {
    ruleset: [() => truthy()],
    weight: -1, // Такое правило все равно приоритетнее default указанного выше
    data: 42
  },
  {
    ruleset: [truthy],
    weight: 0, // Эквивалентно отсутствию веса, можно не указывать такое значение
    data: 42
  },
  {
    ruleset: [() => true],
    weight: 1,
    data: 42
  },
  {
    ruleset: [() => true],
    weight: Number.POSITIVE_INFINITY, // Максимально возможный вес.
    data: 42
  },
  {
    ruleset: [() => true],
    weight: Number.POSITIVE_INFINITY, // Однако это правило все еще важнее, т.к. находится ниже.
    data: 42
  }
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
