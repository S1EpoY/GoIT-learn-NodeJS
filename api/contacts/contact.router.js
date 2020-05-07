const { Router } = require("express");

const {
  getAllContacts,
  getContactById,
  postNewContact,
  patchContactById,
  deleteContactById,
  getContactByIdx,
  patchContactByIdx,
  deleteContactByIdx
} = require('./contact.controller');

const {
  validateContactIdParams,
  validateNewContact,
  validateUpdatedContact
} = require('./contact.validator')

const contactRouter = Router();

/**
 * routs with path '/api/contacts'
 */
contactRouter.get("/", getAllContacts);
contactRouter.get("/:contactId", validateContactIdParams, getContactById);
contactRouter.post("/", validateNewContact, postNewContact);
contactRouter.patch("/:contactId", validateContactIdParams, validateUpdatedContact, patchContactById);
contactRouter.delete("/:contactId", validateContactIdParams, deleteContactById);

contactRouter.get("/idx/:contactIdx", getContactByIdx);
contactRouter.patch("/idx/:contactIdx", validateUpdatedContact, patchContactByIdx);
contactRouter.delete("/idx/:contactIdx", deleteContactByIdx);

module.exports = contactRouter;