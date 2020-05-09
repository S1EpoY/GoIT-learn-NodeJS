const { Types: {ObjectId} } = require('mongoose');
const Joi = require('joi');
const dotenv = require('dotenv');
const contactModel = require('../contacts/contact.model');
const userModel = require('../users/user.model');
const isRedirectURLExists = require('../helpers/validatorURL');

dotenv.config();

class UserValidator {
    /**
     * validation signIn parameters user 
     * if the body does not have any required fields, returns json with the key `{"message":"Missing required fields"}` and send status 422
     */
    async validateKeys(req, res, next) {
        try {
            const userRules = Joi.object().keys({
                email: Joi.string().email().required(),
                password: Joi.string().regex(/^[a-zA-Z0-9]{6,16}$/).alphanum().min(6).max(16).required()
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
    async validateSubData(req, res, next) {
        try {
            const bodyRules = Joi.object({
                email: Joi.string().email().required(),
                subscription: Joi.string().required(),
            });

            await Joi.validate(req.body, bodyRules);

            next();
        } catch {
            res.status(422).json({
                message: "Missing required fields"
            });
        }
    }


    /**
     * validation user email
     * if user email is invalid return json with key `{"message": "Missing required fields"}` and send status 422
     */
    async validateEmail(req, res, next) {
        try {
            const bodyRules = Joi.object({
                email: Joi.string().email().required()
            });

            await Joi.validate(req.body, bodyRules);

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
    async validateId(req, res, next) {
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
     * validation user registration
     * if user registered field doesn`t true send status 401
     */
    async validateRegistretion(req, res, next) {
        try {
            const { user } = req.body;

            if(user.registered !== true) return res.sendStatus(401);

            next()
        } catch (err) {
            next(err);
        }

    }


    /**
     * check email for uniqueness
     * if user email is invalid return json with key `{"message": "Email in use"}` and send status 400
     */
    async checkEmailForUniqueness(req, res, next) {
        try {
            const {email} = await req.body;
      
            const existingUser = await userModel.findUserByEmail(email);
            if(existingUser) return res.status(400).json({message: "Email in use"});

            next()
        } catch (err) {
            next(err);
        }

    }


    /**
     * check user email matches email in user database
     * if user email doesn't exist return json with key `{"message": "Wrong login or password"}` and send status 401
     */
    async checkEmailForMatchesInUserDB(req, res, next) {
        try {
            const {email} = await req.body;

            const existingUser = await userModel.findOne({email});

            if(!existingUser) return res.status(401).json({message: 'Wrong login or password'});

            req.body = {
                ...req.body,
                user: existingUser
            }

            next()
        } catch (err) {
            next(err);
        }
    }


    /**
     * check user email match for contact email
     * if user email match pass to `req.body` json with key `{"name": "contact.name", "contactId": "contact._id"}` and return next()
     */
    async checkEmailForMatchesInContactDB(req, _, next) {
        try {
            const {email} = await req.body;
            const existingContact = await contactModel.findOne({email});

            if(existingContact) {
                req.body = {
                    ...req.body,
                    name: existingContact.name,
                    contactId: existingContact._id
                }
            }  

            next()
        } catch (err) {
            next(err);
        }

    }
    

    /**
     * check URL for redirect link using OTPCode 
     * if URL is valid, redirected to that URL
     * if URL is invalid returned next() 
     */
    async validateAndRedirectURL(_, res, next) {
        try{
            const URL = process.env.REDIRECT_URL;
            const existsURL = await isRedirectURLExists(URL);

            if(existsURL) return res.redirect(URL);

            next();
        } catch(err) {
            next(err);
        }
    }
}

module.exports = new UserValidator();