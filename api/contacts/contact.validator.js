const { Types: {ObjectId} } = require('mongoose');
const Joi = require('joi');
class ContactValidator {
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
            res.status(400).json({
                "message": "missing required name field"
            });
        }
    }


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


    /**
     * validation parameters ID of contact 
     * if contact id is invalid return json with key {message: "missing fields"} and send status 400
     */
    async validateContactIdParams(req, res, next) {
        try {
            const {contactId} = req.params;

            if (!ObjectId.isValid(contactId)) return res.status(400).json({
                message: "missing fields"
            });

            next();
        } catch(err) {
            next(err);
        }

    }

}

module.exports = new ContactValidator();