const { Router } = require("express");

const {
  getAllContacts,
  getContactById,
  postNewContact,
  patchContactById,
  deleteContactById,
  getContactByIdx,
  patchContactByIdx,
  deleteContactByIdx,
  validateId,
  validateNewContact,
  validateUpdatedContact
} = require('./contact.controller');

const contactRouter = Router();

/**
 * api routs
 */
contactRouter.get("/", getAllContacts);
contactRouter.get("/:contactId", validateId, getContactById);
contactRouter.post("/", validateNewContact, postNewContact);
contactRouter.patch("/:contactId", validateId, validateUpdatedContact, patchContactById);
contactRouter.delete("/:contactId", validateId, deleteContactById);

contactRouter.get("/idx/:contactIdx", getContactByIdx);
contactRouter.patch("/idx/:contactIdx", validateUpdatedContact, patchContactByIdx);
contactRouter.delete("/idx/:contactIdx", deleteContactByIdx);

module.exports = contactRouter;