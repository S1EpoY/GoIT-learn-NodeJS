﻿# GoIT-learn-NodeJS-basics




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

### @ PATCH /api/contacts/:contactId

- Получает `body` в json-формате c обновлением любых полей `name, email и phone`
- Если `body` нет, возарщает json с ключом `{"message": "missing fields"}` и
  статусом `400`
- Если с `body` все хорошо, вызывает функцию `updateContact(id)` для
  обновления контакта в файле `contacts.json`
- По результату работы функции возвращает обновленный обьект контакта со
  статусом `200`. В противном случае, возвращает json-файл с ключом
  `{"message": "Not found"}` и статусом `404`

### @ DELETE /api/contacts/:contactId

- Не получает `body`
- Получает параметр `contactId`
- вызывает функцию `removeContact(id)` для работы с json-файлом `contacts.json`
- если такой `id` есть, возвращает json формата `{"message": "contact deleted"}` со
  статусом `200`
- если такого `id` нет, возвращает json-файл с ключом `{"message": "Not found"}` и
  статусом `404`




## Работы с базой данных MongoDB

Документ db-contacts хранит в себе коллекцию contacts в формате json.

- Написан код для создания подключения к MongoDB при помощи
  [Mongoose](https://mongoosejs.com/).
  - При успешном подключении выведит в консоль сообщение
    `"Database connection successful"`.
  - Обработана ошибка подключения. Выведино в консоль сообщение ошибки
    и завершен процесс используя `process.exit(1)`.
- В функциях обработки запросов заменен код CRUD-операций над контактами из
  файла, на Mongoose-методы для работы с коллекцией контактов в базе данных.

