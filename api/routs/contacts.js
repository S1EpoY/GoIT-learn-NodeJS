const { Router } = require("express");
const router = Router();
const Joi = require("joi")

const {
  listContacts,
  getContactById,
  addContact,
  updateContact,
  removeContact
} = require('../../contacts');


// GET /api/contacts
// ничего не получает
// вызывает функцию listContacts для работы с json-файлом contacts.json
// возвращает массив всех контактов в json-формате со статусом 200

/**
 * calls the function 'listContacts()' to work with the contacts.json file
 * returns an array of all contacts in json format with a status of 200
 */
router.get("/contacts", (_, res) => {
  try {
    const contacts = listContacts();
    res.status("200").json(contacts);
  } catch {
    res.sendStatus(400);
  }
});


// GET /api/contacts/:contactId

// - Не получает body
// - Получает параметр `contactId`
// - вызывает функцию getById для работы с json-файлом contacts.json
// - если такой id есть, возвращает обьект контакта в json-формате со статусом 200
// - если такого id нет, возвращает json с ключом `"message": "Not found"` и
//   статусом 404

/**
 * gets the 'contactId' parameter
 * calls the function 'getById()' to work with the contacts.json file
 * if there is such an id, returns a contact object in json format with a status 200
 * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
 */
router.get("/contacts/:contactId", async (req, res) => {
  try {
    const id = await Number(req.params.contactId);
    const contact = getContactById(id);
    if(!contact) return res.status(404).json({message: "Not found"});
    return res.status("200").json(contact);
  } catch {
    res.sendStatus(400);
  }
});


// POST /api/contacts

// - Получает body в формате `{name, email, phone}`
// - Если в body нет каких-то обязательных полей, возарщает json с ключом
//   `{"message": "missing required name field"}` и статусом 400
// - Если с body все хорошо, добавляет уникальный идентификатор в обьект контакта
// - Вызывает функцию `addContact()` для сохранения контакта в файле contacts.json
// - По результату работы функции возвращает обьект с добавленным id
//   `{id, name, email, phone}` и статусом 201

/**
 * gets the body in the format of `{name, email, phone}`
 * if the body does not have any required fields, returns json with the key `{"message":"missing required name field"}` and status 400
 * if everything is fine with the body, adds a unique identifier to the contact object
 * calls the function 'addContact()' to save the contact in the contacts.json file
 * the function returns the object with the added id `{id, name, email, phone}` and status 201
 */
router.post( "/contacts", 
  async (req, res, next) => {
    try {
      const contactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required() //(000) 000-0000
    });

    await Joi.validate(req.body, contactRules);

    next();
    
    } catch {
      res.sendStatus(400);
    }
  },

  async (req, res) => {
    try {
      const data = await req.body;
      const contacts = listContacts();
      const newContact = {id: contacts.length + 1, ...data}

      addContact(newContact);
      res.status(201).json(newContact);
    } catch {
      res.sendStatus(400);
    };
});


// PATCH /api/contacts/:contactId

// - Получает body в json-формате c обновлением любых полей `name, email и phone`
// - Если body нет, возарщает json с ключом `{"message": "missing fields"}` и
//   статусом 400
// - Если с body все хорошо, вызывает функцию `updateContact(id)` (напиши ее) для
//   обновления контакта в файле contacts.json
// - По результату работы функции возвращает обновленный обьект контакта и
//   статусом 200. В противном случае, возвращает json с ключом
//   `"message": "Not found"` и статусом 404

/**
 * gets the body in json format with updating any fields of 'name, email and phone'
 * if body is not present, returns json with key `{"message":"missing fields"}` and status 400
 * if everything is fine with the body, calls the function 'updateContact(id)' to update the contact in the contacts.json file
 * the function returns an updated object with a contact and with a status of 200. Otherwise, it returns json with the key '{"message":"Not found"}'and status 404
 */
router.patch("/contacts/:contactId", 

  async (req, res, next) => {
    try {
      const contactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string() //(000) 000-0000
    });

    await Joi.validate(req.body, contactRules);

    next();
  
    } catch {
      res.sendStatus(400);
    }
  },

  async (req, res) => {
    try{
      const id = await Number(req.params.contactId);
      const data = await req.body;
      const desiredContact = getContactById(id);
      
      if(!Object.keys(data).length) return res.status(400).json({message: "missing fields"});
      if(!desiredContact) return res.status(404).json({message: "Not found"});

      const updatedContact = updateContact({id, ...data});

      return res.status(200).json(updatedContact);

    } catch {
      res.sendStatus(400);
    }
    
  }); 


// DELETE /api/contacts/:contactId

// - Не получает body
// - Получает параметр `contactId`
// - вызывает функцию `removeContact` для работы с json-файлом contacts.json
// - если такой id есть, возвращает json формата `{"message": "contact deleted"}` и
//   статусом 200
// - если такого id нет, возвращает json с ключом `"message": "Not found"` и
//   статусом 404

/**
 * gets the 'contactId' parameter
 * calls the function `removeContact` to work with the contacts.json file
 * if there is such an id, returns json of the format `{"message":"contact deleted"}` and a status 200
 * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
 */
router.delete("/contacts/:contactId", 
  async (req, res) => {
    try {
      const id = await Number(req.params.contactId);
      const result = removeContact(id);

      if(!result) return res.status(404).json({"message": "Not found"});

      return res.status(200).json({"message": "contact deleted"});
    } catch {
      res.sendStatus(400);
    };
  });


module.exports = router;