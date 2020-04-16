const Joi = require("joi");
const contactModel = require('./contact.models');
const { Types: { ObjectId } } = require('mongoose');


class ContactController {
  /**
   * returns an array of all contacts in json format with a status of 200
   */
  async getAllContacts (_, res)  {
    try {
      const contacts = await contactModel.find();

      res.status("200").json(contacts);
    } catch {
      res.sendStatus(400);
    }
  };


  /**
   * gets the 'contactId' parameter
   * if there is such an id, returns a contact object in json format with a status 200
   * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
   */
  async getContactById(req, res) {
    try {
      const { contactId } = await req.params;
      const contact = await contactModel.findById(contactId);

      if (!contact) return res.status(404).json({message: "Not found"});

      return res.status("200").json(contact);
    } catch {
      res.sendStatus(400);
    }
  };


  /**
   * gets the body in the format of `{name, email, phone}`
   * if everything is fine with the body, adds a unique identifier to the contact object
   * the function returns the object with the added id `{id, name, email, phone}` and status 201
   */
  async postNewContact(req, res) {
    try{
      const newContact = await contactModel.createWithIdx(req.body);
      
      res.status(201).json(newContact);
    } catch {
      res.sendStatus(400);
    }
  };


  /**
   * gets the body in json format with updating any fields of 'name, email and phone'
   * if body is not present, returns json with key `{"message":"missing fields"}` and status 400
   * the function returns an updated object with a contact and with a status of 200. Otherwise, it returns json with the key '{"message":"Not found"}'and status 404
   */
  async patchContactById(req, res) {
    try {
      const {contactId} = await req.params;
      const contactToUpdate = await contactModel.findContactByIdAndUpdate(contactId, req.body);
      
      if (!contactToUpdate) return res.status(404).json({ message: "Not found" });

      return res.status(200).json(contactToUpdate);
    } catch {
      res.sendStatus(400);
    }
  };


  /**
   * gets the 'contactId' parameter
   * if there is such an id, returns json of the format `{"message":"contact deleted"}` and a status 200
   * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
   */
  async deleteContactById(req, res) {
    try {
      const {contactId} = await req.params;
      const deletedContact = await contactModel.findByIdAndDelete(contactId);

      if (!deletedContact) return res.status(404).json({"message": "Not found"});

      contactModel.updateIdxContacts();

      return res.status(200).json({ "message": "contact deleted" });
    } catch {
      res.sendStatus(400);
    };
  };


    /**
   * gets the 'contactIdx' parameter
   * if there is such an idx, returns a contact object in json format with a status 200
   * if there is no such idx, returns json with the key `{"message":"Not found"}` and status 404
   */
  async getContactByIdx(req, res) {
    try {
      const { contactIdx } = await req.params;
      const contact = await contactModel.findOne({idx: contactIdx});

      if (!contact) return res.status(404).json({message: "Not found"});

      return res.status("200").json(contact);
    } catch {
      res.sendStatus(400);
    }
  };


  /**
  * gets the body in json format with updating any fields of 'name, email and phone'
  * if body is not present, returns json with key `{"message":"missing fields"}` and status 400
  * the function returns an updated object with a contact and with a status of 200. Otherwise, it returns json with the key '{"message":"Not found"}'and status 404
  */
  async patchContactByIdx(req, res) {
    try {
      const {contactIdx} = await req.params;
      const contactToUpdate = await contactModel.findOneAndUpdate({idx: contactIdx}, req.body, {new: true});
      
      if (!contactToUpdate) return res.status(404).json({ message: "Not found" });

      return res.status(200).json(contactToUpdate);
    } catch {
      res.sendStatus(400);
    }
  };


  /**
   * gets the 'contactId' parameter
   * if there is such an id, returns json of the format `{"message":"contact deleted"}` and a status 200
   * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
   */
  async deleteContactByIdx(req, res) {
    try {
      const {contactIdx} = await req.params;
      const deletedContact = await contactModel.findOneAndDelete({idx: contactIdx});

      if (!deletedContact) return res.status(404).json({"message": "Not found"});

      contactModel.updateIdxContacts();

      return res.status(200).json({ "message": "contact deleted" });
    } catch {
      res.sendStatus(400);
    };
  };  


  /**
   * validation parameters ID of contact 
   */
  async validateId(req, res, next) {
    const id = await req.params.contactId;

    if (!ObjectId.isValid(id)) return res.status(400).json({message: "missing fields"});

    next()
  }


  /**
  * validation parameters new contact 
  * if the body does not have any required fields, returns json with the key `{"message":"missing required name field"}` and status 400
  */
  async validateNewContact(req, res, next) {
    try {
      const contactRules = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().required(),
        phone: Joi.string().required() //(000) 000-0000
      });

      await Joi.validate(req.body, contactRules);

      next();
    } catch {
      res.status(400).json({"message":"missing required name field"});
    }
  };

  /**
   * validation contact parameters during update
   * if the body does not have any required fields, returns json with the key `{"message":"missing required name field"}` and status 400
   */
  async validateUpdatedContact(req, res, next) {
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
  }
}

module.exports = new ContactController();