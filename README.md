# COMPOSITOR library
<i>by Alexandr "Mordvin" Shaporov<br>
<br>
a.shaporov@worksolutions.ru<br>
2022</i>

## Легковесная библиотека без зависимостей для реализации Стратегии любой сложности

### Что это за библиотека?

StrategyResolver - библиотека, реализующая паттерн Стратегия. Больше никаких вложенных условий!

1. Создайте специальный массив объектов - Композицию.
2. Для каждого объекта в композиции, укажите ситуацию, в которой он должен возвращаться.
3. Вызовите метод StrategyResolver.resolve(Composition), и получите то, что ожидаете. MAGIC!

```
{
    ruleset: [isUserExist], // Массив предикатов, функций возвращающих true/false
    weight: 0, // Вес объекта, по умолчанию 0 
    important: false, // Для исключительных случаев, по умолчанию false 
    data: 42, // то, что вернется из resolve()
    callback: () => 42 // результат вернется из resolve()
}
```

### Core features

- #### Интуитивно понятная логика работы.
Большинство людей читают слева направо и сверху вниз. В объектах композиции все точно так же. Зачастую все, что вам нужно,
это выполнение самого строго условия. По умолчанию те объекты, которые идут позже в массиве композиции, являются более важными.
Таким образом вы пишите интуитивно понятный код, и получаете интуитивно ожидаемый результат

```

{
    ruleset: [isUserExist],
    data: 42
},
{
    // Второй объект важнее т.к. находится дальше в массиве, даже если подходят оба объекта
    ruleset: [isUserExist, isUserExpert],
    data: 42
}

```


- #### Всего 3 свойства для настройки, из которых 2 - опциональные.
Единственное обязательное поле для работы StrategyResolver - ruleset, массив чистых функций-предикатов. StrategyResolver проверяет и кэширует каждую функцию.
Каждый предикат должен вернуть true или truthy значение.
Если хотя бы одна функция не прошла проверку, значит этот объект композиции не подходит под текущий запрос.

```

{
    // Вариант задания значения "по умолчанию"
    ruleset: [() => true],
    data: 42
},

```

- #### Простая структура. Никакой вложенности, код не растет в ширину независимо от сложности условий.
С помощью StrategyResolver вы можете создавать сложные условия, включающие в себя неограчинную вложенность.
Также возможно создавать вложенные массивы, тогда они вычисляются как логическое ИЛИ

```

{   
    ruleset: [ /* IF */
        [isUserExist, /* AND */ isUserExpert, /* AND */ isUserPremium], // OR
        [isUserExist, /* AND */ isUserBasic, /* AND */ isUserPremium]   // OR
        [isNoUser, isColdNow], 
    ],
    data: 42
},

```

- #### Система весов. По аналогии со специфичностью селекторов CSS, вы можете указывать специфичность условий.
Для удобства, вес по умолчанию - 0. Вы можете изменять вес как в большую сторону, так и в меньшую. 
При использовании весов все еще можно указать default сценарий.

```

{   
    ruleset: [() => true],
    weight: Number.NEGATIVE_INFINITY  // Вариант указания "по-настоящему default" значения.
    data: 42
},
{   
    ruleset: [anyRule],
    weight: -1 // Такое правило все равно приоритетнее default указанного выше
    data: 42
},
{   
    ruleset: [anyRule],
    weight: 0 // Эквивалентно отсутствию веса, можно не указывать такое значение
    data: 42
},
{   
    ruleset: [anyRule],
    weight: 1
    data: 42
},
{
    ruleset: [anyRule],
    weight: Number.POSITIVE_INFINITY // Максимально возможный вес. 
    data: 42
},
{
    ruleset: [anyRule],
    weight: Number.POSITIVE_INFINITY // Однако это правило все еще важнее, т.к. находится ниже.
    data: 42
}

```

- #### Система important. При нахождении important правила выполнение прерывается досрочно.
Если объект прошел проверку, и у него указано свойство important: true, выполнение остальных проверок прерывается, и немедленно возвращается этот объект.
В отличии от примера с Number.POSITIVE_INFINITY, при наличии двух объектов important вернется ПЕРВЫЙ, а не последний.

``` 
{   
    ruleset: [() => false],
    important: true, // Не пройдет проверку по ruleset
    data: 42
},
{
    ruleset: [() => true],
    important: true, // Остановит выполнение досрочно, и вернет data.
    data: 42
},
{
    ruleset: [() => true], // Не выполнится
    important: true, 
    data: 42
}
```

- #### Автоматический вызов функций. Можно указать функцию, которая выполнится сразу же, после нахождения подходящего под условия объекта.
С помощью StrategyResolver очень удобно определять стратегии поведения, и сразу же их выполнять. Для этого есть отдельное свойство callback. 
Если вы укажете одновременно data и callback, то data передастся в callback как аргумент при вызове.

StrategyResolver выполнит callback, и вернет результат выполнения.

``` 
const strategies = [
    {   
        ruleset: [() => true],
        data: 40
        callback: (arg) => arg + 2
    }
]

const result = StrategyResolver.resolve(strategies) // === 42
```

- #### Кэшерование проверок.
Для ускорения работы, при каждом вызове resolve StrategyResolver создает кэш, в котором хранит все функции и результаты их выполнения.
После выполнения функции кэш уничтожается, так что новый вызов приведет к перерасчету всех правил.

Вы можете повторно разрешать одни и те же композиции, и получать разные результаты в зависимости от внешних переменных, при этом в рамках одного вызова
можно без ущерба производительности вызывать одни и те же функции.

``` 

{   
    ruleset: [expensiveComputations], // Вычисляем...
    callback: () => 42
},
{   
    ruleset: [expensiveComputations], // Берем из кэша
    callback: () => 42
}

```

### Подводные камни

#### Не рассчитывайте, что выполнится каждая проверка
Выполнение проверок кэшируется, поэтому не стоит рассчитывать, что выполнится каждая. 
Предикаты должны быть чистыми функциями, т.е. не иметь сайд-эффектов и должны выдавать стабильный результат!

``` 
let counter = 0;

const withSideEffect = () => {
    counter++;
    return true;
}

{   
    ruleset: [withSideEffect],
    callback: () => 42
},
{   
    ruleset: [withSideEffect],
    callback: () => 42
},

counter === 1 // Упс, второй вызов не случился.

```

#### Не используйте дорогие стрелочные функции

Т.к. `() => doStuff()` это по сути объявление функции, вторая такая же запись создаст еще одну функцию. При этом, это будут разные функции, делающие одно и то же.

Это неэкономично по отношению к памяти, и это невозможно кешировать, т.к. функции имеют разные ссылки.

``` 
const a = () => doStuff();
const b = () => doStuff();

a === b // false

{   
    ruleset: [() => expensiveComputations()],
    callback: () => 42
},
{   
    ruleset: [() => expensiveComputations()], // Это две РАЗНЫЕ функции, делающие одно и то же.
    callback: () => 42
}

```

Чаще всего это проявляется для добавление логического НЕ.

``` 

{   
    ruleset: [() => !isUserFinishedAllLessons],
    callback: () => 42
},

const isUserNotFinishedAllLessons = () => !isUserFinishedAllLessons

{   
    ruleset: [isUserNotFinishedAllLessons],
    callback: () => 42
},

```

Не используйте стрелочную функцию, если она дублируется и стоит дорого.

### Use cases top:
Примеры небольшие, но передают общую суть. Полностью ценность библиотеки раскрывается на 10-20 условиях и более.

#### 1. Conditional redirecting
В более общей формулировке: "Сделай то, что сейчас нужно сделать"

``` 
{   
    // Дефолтный случай, выкидываем домой
    ruleset: [() => true],
    callback: () => redirectTo(url.homepage)
},
{   
    // Если доступа нет, то отправляем на страницу "нет доступа"
    ruleset: [isAccessDenied],
    callback: () => redirectTo(url.noAccess)
},
{   
    // Если доступа нет, НО у пользователя есть доступ к другой приватной странице
    ruleset: [noAccess, () => hasAccessTo(url.anotherPrivatePage)],
    callback: () => redirectTo(url.anotherPrivatePage)
},

```

#### 2. Conditional Configurations
В более общей формулировке: "Дай мне данные под конкретный случай"
``` 
{   
    ruleset: [() => true],
    data: {
        color: "white",
        welcomingText: "Привет!",
        showAdvancedTools: false
    }
},
{   
    ruleset: [isPremiumUser],
    data: {
        color: "red",
        welcomingText: "Добро пожаловать",
        showAdvancedTools: true
    }
},

```

### TODO LIST
- Реквестируется типизация всего этого дела, однако это не такая легкая задача, т.к. много полиморфизма.
