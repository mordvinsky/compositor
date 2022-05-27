# COMPOSITOR library
<i>by Alexandr "Mordvin" Shaporov<br>
<br>
a.shaporov@worksolutions.ru<br>
2022</i>

## Легковесная библиотека без зависимостей для реализации Стратегии любой сложности

### Что это за библиотека?

Compositor - библиотека, реализующая паттерн Стратегия. Больше никаких вложенных условий!

1. Создайте специальный массив объектов - Композицию.
2. Для каждого объекта в композиции, укажите ситуацию, в которой он должен возвращаться.
3. Вызовите метод Compositor.resolve(Composition), и получите то, что ожидаете. MAGIC!

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
Единственное обязательное поле для работы Compositor - ruleset, массив чистых функций-предикатов. Compositor проверяет и кэширует каждую функцию.
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
С помощью Compositor вы можете создавать сложные условия, включающие в себя неограчинную вложенность.
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
Если объект проходит проверку, и у него указано свойство important: true, выполнение проверки прерывается, и немедленно возвращается этот объект.
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
С помощью Compositor очень удобно определять стратегии поведения, и сразу же их выполнять. Для этого есть отдельное свойство callback.
Callback приоритетнее data, поэтому указывать оба свойства не имеет смысла. При использовании с TypeScript в таком случае выведется ошибка.

Compositor выполнит callback, и вернет результат выполнения.

``` 
const strategies = [
    {   
        ruleset: [() => true],
        callback: () => 42
    }
]

const a = Compositor.resolve(strategies) // === 42
```

- #### Кэшерование проверок.
Для ускорения работы, при каждом вызове resolve Compositor создает кэш, в котором хранит все функции и результаты их выполнения.
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

- #### Поддержка вложенных объектов через метод navigate и resolveFrom("data.nested.obj", NestedComps)

Вы можете использовать один общий объект data, внутри которого где-то будет находиться композиция.
Для вычисления композиций из таких объектов есть метод navigate и resolveFrom("data.nested.obj", NestedComps)

``` 
Compositor.Navigate("data.nested.obj", NestedComps) === NestedComps.data.nested.obj

Compositor.resolveFrom("data.nested.obj", NestedComps) === Compositor.resolve(NestedComps.data.nested.obj)
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
Система кэширования не поддерживает стрелочные функции. Такие функции вычисляются каждый раз, когда вызываются. 
Если такая логика повторяется много раз, либо занимает много времени на вычисление, лучше выделить эту логику в отдельную функцию,
и использовать прямо по имени.

``` 

{   
    ruleset: [() => expensiveComputations],
    callback: () => 42
},
{   
    ruleset: [() => expensiveComputations], // Это две РАЗНЫЕ функции, делающие одно и то же.
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

### Work in progress
- Улучшенная типизация
- Тестирование
- Юзкейсы
- NPM
- Debug-режим
