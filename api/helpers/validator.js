const {
    Types: {
        ObjectId
    }
} = require('mongoose');
const Joi = require('joi');

class JoiValidator {
    /**
     * validation signIn parameters user 
     * if the body does not have any required fields, returns json with the key `{"message":"Missing required fields"}` and send status 422
     */
    async validateUserKeys(req, res, next) {
        try {
            const userRules = Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{4,16}$/).alphanum().min(4).max(16).required()
            });

            await Joi.validate(req.body, userRules);

            next();
        } catch {
            res.status(422).json({
                message: "Missing required fields"
            });
        }
    }


    /**
     * validation updated subscription parameters user 
     * if the body does not have any required fields, returns json with the key `{"message":"Missing required fields"}` and send status 422
     */
    async validateUserSubData(req, res, next) {
        try {
            const bodyRules = Joi.object({
                email: Joi.string().email().required(),
            });

            const queryRules = Joi.string().required();

            await Joi.validate(req.body, bodyRules);
            await Joi.validate(req.query.sub, queryRules);

            next();
        } catch {
            res.status(422).json({
                message: "Missing required fields"
            });
        }
    }


    /**
     * validation object-ID of user
     * if user id is invalid return json with key `{"message": "missing fields"}` and send status 400
     */
    async validateUserId(req, res, next) {
        try {
            const userId = req.user._id;

            if (!ObjectId.isValid(userId)) return res.status(400).json({
                message: "missing fields"
            });

            next()
        } catch (err) {
            next(err);
        }

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

module.exports = new JoiValidator();