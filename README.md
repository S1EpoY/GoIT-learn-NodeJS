# Домашнее задание 1 (GoIT-learn-NodeJS-HW01-basics)

Создно ветку `01-node-basics` из ветки `master`.

## Шаг 1

- Проведена инициализфция npm в проекте
- В корне проекта создан файл `index.js`
- Инициализирован пакет [nodemon](https://www.npmjs.com/package/nodemon) как зависимость
  разработки (devDependencies)
- В файле `package.json` добавлены "скрипты" для запуска `index.js`
  - Скрипт `start` который запускает `index.js` с помощью `node`
  - Скрипт `dev` который запускает `index.js` с помощью `nodemon`

## Шаг 2

В корне проекта создано папку `db`. Для хранения контактов используеться
файл [contacts.json](./contacts.json), который лежит в папке `db`.

В корне проекта создано файл `contacts.js`.

- Сделано импорт модулей `fs` и `path` для работы с файловой системой
- Создано переменную `contactsPath` внутри которой указан путь к файлу `contacts.json`.
  Для составления пути ипользуються методы модуля `path`.
- Добавлены функции для работы с коллекцией контактов. В функциях использован модуль
  `fs` и его методы `readFile()` и `writeFile()`
- Сделано экспорт созданных функций через `module.exports`

```js
// contacts.js

// TODO: задокументировано каждую функцию
function listContacts() {
  // ...мой код
}

function getContactById(contactId) {
  // ...мой код
}

function addContact({ name, email, phone }) {
  // ...мой код
}

function removeContact(contactId) {
  // ...мой код
}
```

## Шаг 3

Импортирован модуль `contacts.js` в файле `index.js` и проверены на
работоспособность функции для работы с контактами.

## Шаг 4

В файле `index.js` импортирован пакет `yargs` для удобного парса аргументов
командной строки. Используеться готовая функция `invokeAction()` которая получает
тип выполняемого действия и необходимые аргументы. Функция вызывает
соответствующий метод из файла `contacts.js` передавая ему необходимые
аргументы.

```js
// index.js
const argv = require("yargs").argv;

// TODO: рефакторить
function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      // ...
      break;

    case "get":
      // ... id
      break;

    case "add":
      // ... name email phone
      break;

    case "remove":
      // ... id
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
```

## Шаг 5

После запуска команд в терминале сделаны скриншоты результата выполнения
каждой команды согласно условиям.

```shell
# Получаем и выводим весь список контакстов в виде таблицы (console.table)
node index.js --action="list"
```

>*Результат выполнения кода:*

![ACTION LIST IMG EXAMPLE](https://picua.org/images/2020/03/25/139adbbf4ea19cc6f63ad5b88e99f8bd.png "action = list")

```shell
# Получаем контакт по id
node index.js --action="get" --id=5
```

>*Результат выполнения кода:*

![ACTION GET IMG EXAMPLE](https://picua.org/images/2020/03/25/4485f6725b3ddd9736ef07e342589952.png "action = get")

```shell
# Добавялем контакт
node index.js --action="add" --name="Mango" --email="mango@gmail.com" --phone="322-22-22"
```

>*Результат выполнения кода:*

![ACTION ADD IMG EXAMPLE](https://picua.org/images/2020/03/25/f748830c8d47d301270c26a0ae69ac3e.png "action = add")

```shell
# Удаляем контакт
node index.js --action="remove" --id=3
```

>*Результат выполнения кода:*

![ACTION REMOVE IMG EXAMPLE](https://picua.org/images/2020/03/25/5d6c6072d6ab29d7085797ca1f3616af.png "action = remove")
