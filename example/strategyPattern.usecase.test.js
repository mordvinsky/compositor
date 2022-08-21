<<<<<<<< HEAD:example/strategyPattern.usecase.test.ts
import { CallableComposition } from "../../src/strategyResolver.types";
import StrategyResolver from "../../src/strategyResolver";
========
import StrategyResolver from "../src/strategyResolver";
>>>>>>>> refactor/v2general:example/strategyPattern.usecase.test.js

const c = new StrategyResolver();

describe("Пример реализация паттерна Стратегия c помощью библиотеки", () => {
 test("Поприветствуем пользователя должным образом в зависимости от его параметров", ()=> {
   const user = {
     name: "Alexandr Shaporov",
     role: "Expert",
     progress: 80,
     primeStatus: false,
   }

   const isUserNameExist = () => !!user.name;
   const isUserNovice = () => user?.role === "Novice"
   const isUserExpert = () => user?.role === "Expert"
   const isUserInSecondHalf = () => user?.progress >= 50
   const isPrimeUser = () => user?.primeStatus

   const shouldBeFired = jest.fn(() => console.log(`Добро пожаловать, Магистр!`));

   const strategies = [
     {
       ruleset: [() => true], // аналогично default
       weight: Number.NEGATIVE_INFINITY, // т.к. weight по умолчанию 0, эта конструкция гарантирует, что правило перезапишется ЛЮБЫМ объектом, даже с весом -999
       callback: () => console.log("Привет, Гость!")
     },
     {
       ruleset: [isUserNameExist],
       callback: () => console.log(`Привет, ${user.name}`)
     },
     {
       ruleset: [isUserNovice],
       callback: () => console.log(`Привет, новичок!`)
     },
     {
       ruleset: [isUserExpert, isUserNameExist],
       callback: () => console.log(`Здравствуйте, дорогой ${user.name}`)
     },
     {
       ruleset: [isUserExpert, isUserInSecondHalf],
       callback: shouldBeFired,
     },
     {
       ruleset: [isUserNameExist, isPrimeUser],
       callback: () => console.log(`Преклоняюсь перед вашим величием!`)
     }
   ]

   expect(c.resolve(strategies)).toBeUndefined();
   expect(shouldBeFired.mock.calls.length).toBe(1);
 })
})
