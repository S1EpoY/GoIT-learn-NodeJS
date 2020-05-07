const contactModel = require('./contact.model');


class ContactController {
  /**
   * returns an array of all contacts in json format with a status of 200
   * using mongoose-paginate-v2
   */
  async getAllContacts (req, res)  {
    try {
      const { page, limit, sub } = await req.query;

      let options = null;
      let contacts = null;
      
      if(page || limit) {
        if(page) options = { page };
        if(limit) options = { ...options, limit };
        
        contacts = await contactModel.paginate({}, options);
      }

      if(sub) contacts = await contactModel.paginate({user: {subscription:sub}}, options);

      res.status("200").json(contacts);
    } catch {
      res.sendStatus(400);
    }
  }


  /**
   * gets the 'contactId' parameter
   * if there is such an id, returns a contact object in json format with a status 200
   * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
   */
  async getContactById(req, res) {
    try {
      const { contactId } = req.params;
      const contact = await contactModel.findById(contactId);

      if (!contact) return res.status(404).json({message: "Not found"});

      return res.status("200").json(contact);
    } catch {
      res.sendStatus(400);
    }
  }


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
  }


  /**
   * gets the body in json format with updating any fields of 'name, email and phone'
   * if body is not present, returns json with key `{"message":"missing fields"}` and status 400
   * the function returns an updated object with a contact and with a status of 200. Otherwise, it returns json with the key '{"message":"Not found"}'and status 404
   */
  async patchContactById(req, res) {
    try {
      const {contactId} = req.params;
      const contactToUpdate = await contactModel.findContactByIdAndUpdate(contactId, req.body);
      
      if (!contactToUpdate) return res.status(404).json({ message: "Not found" });

      return res.status(200).json(contactToUpdate);
    } catch {
      res.sendStatus(400);
    }
  }


  /**
   * gets the 'contactId' parameter
   * if there is such an id, returns json of the format `{"message":"contact deleted"}` and a status 200
   * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
   */
  async deleteContactById(req, res) {
    try {
      const {contactId} = req.params;
      const deletedContact = await contactModel.findByIdAndDelete(contactId);

      if (!deletedContact) return res.status(404).json({"message": "Not found"});

      contactModel.updateIdxContacts();

      return res.status(200).json({ "message": "contact deleted" });
    } catch {
      res.sendStatus(400);
    }
  }


    /**
   * gets the 'contactIdx' parameter
   * if there is such an idx, returns a contact object in json format with a status 200
   * if there is no such idx, returns json with the key `{"message":"Not found"}` and status 404
   */
  async getContactByIdx(req, res) {
    try {
      const { contactIdx } = req.params;
      const contact = await contactModel.findOne({idx: contactIdx});

      if (!contact) return res.status(404).json({message: "Not found"});

      return res.status("200").json(contact);
    } catch {
      res.sendStatus(400);
    }
  }


  /**
  * gets the body in json format with updating any fields of 'name, email and phone'
  * if body is not present, returns json with key `{"message":"missing fields"}` and status 400
  * the function returns an updated object with a contact and with a status of 200. Otherwise, it returns json with the key '{"message":"Not found"}'and status 404
  */
  async patchContactByIdx(req, res) {
    try {
      const {contactIdx} = req.params;
      const contactToUpdate = await contactModel.findOneAndUpdate({idx: contactIdx}, req.body, {new: true});
      
      if (!contactToUpdate) return res.status(404).json({ message: "Not found" });

      return res.status(200).json(contactToUpdate);
    } catch {
      res.sendStatus(400);
    }
  }


  /**
   * gets the 'contactId' parameter
   * if there is such an id, returns json of the format `{"message":"contact deleted"}` and a status 200
   * if there is no such id, returns json with the key `{"message":"Not found"}` and status 404
   */
  async deleteContactByIdx(req, res) {
    try {
      const {contactIdx} = req.params;
      const deletedContact = await contactModel.findOneAndDelete({idx: contactIdx});

      if (!deletedContact) return res.status(404).json({"message": "Not found"});

      contactModel.updateIdxContacts();

      return res.status(200).json({ "message": "contact deleted" });
    } catch {
      res.sendStatus(400);
    }
  }  
}

module.exports = new ContactController();