# GoIT-learn-NodeJS-basics


## Работа с REST API

REST API поддерживает следующие рауты:

### @ GET /api/contacts

- ничего не получает
- вызывает функцию `listContacts()` для работы с файлом `contacts.json`
- возвращает массив всех контактов в json-формате со статусом `200`

### @ GET /api/contacts/:contactId

- Не получает `body`
- Получает параметр `contactId`
- вызывает функцию `getContactById(id)` для работы с файлом `contacts.json`
- если такой `id` есть, возвращает обьект контакта в json-формате со статусом `200`
- если такого `id` нет, возвращает json-файл с ключом `{"message": "Not found"}` и
  статусом `404`

### @ POST /api/contacts

- Получает `body` в формате `{name, email, phone}`
- Если в `body` нет каких-то обязательных полей, возарщает json-файл с ключом
  `{"message": "missing required name field"}` и статусом `400`
- Если с `body` все хорошо, добавляет уникальный идентификатор в обьект контакта
- Вызывает функцию `addContact({name, email, phone})` для сохранения контакта в файле `contacts.json`
- По результату работы функции возвращает обьект с добавленным `id`
  `{id, name, email, phone}` и статусом `201`

### @ DELETE /api/contacts/:contactId

- Не получает `body`
- Получает параметр `contactId`
- вызывает функцию `removeContact(id)` для работы с json-файлом `contacts.json`
- если такой `id` есть, возвращает json формата `{"message": "contact deleted"}` и
  статусом `200`
- если такого `id` нет, возвращает json-файл с ключом `{"message": "Not found"}` и
  статусом `404`

### @ PATCH /api/contacts/:contactId

- Получает `body` в json-формате c обновлением любых полей `name, email и phone`
- Если `body` нет, возарщает json с ключом `{"message": "missing fields"}` и
  статусом `400`
- Если с `body` все хорошо, вызывает функцию `updateContact(id)` для
  обновления контакта в файле `contacts.json`
- По результату работы функции возвращает обновленный обьект контакта и
  статусом `200`. В противном случае, возвращает json-файл с ключом
  `{"message": "Not found"}` и статусом `404`


## Использование "Yargs" в сборке

В сборке используеться пакет [yargs](https://www.npmjs.com/package/yargs) для удобного парса аргументов
командной строки. Функция `invokeAction()` получает тип выполняемого действия и 
необходимые аргументы. Функция вызывает соответствующий метод из файла `contacts.js` 
передавая ему необходимые аргументы.

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

    case "update":
      // ... id name email phone
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


## Результаты выполнения каждой команды:

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
# Обновляем существующий контакт
node index.js --action="update" --id="14" --name="Johnny Boy"
```

>*Результат выполнения кода:*

![ACTION ADD IMG EXAMPLE](https://picua.org/images/2020/04/01/0132d434543ddd48730dec287591303f.png "action = update")

```shell
# Удаляем контакт
node index.js --action="remove" --id=3
```

>*Результат выполнения кода:*

![ACTION REMOVE IMG EXAMPLE](https://picua.org/images/2020/03/25/5d6c6072d6ab29d7085797ca1f3616af.png "action = remove")
