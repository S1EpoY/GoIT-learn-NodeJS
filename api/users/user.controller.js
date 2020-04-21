const { Types: { ObjectId } } = require('mongoose');
const bcryptjs = require('bcryptjs')
const Joi = require("joi");
const userModel = require('./user.model');


class UserController {
  constructor() {
    this._costFactor = 4;
  }


  /**
   * function register new user
   */
  get userSignUp() {
    return this._createUser.bind(this);
  }
  
  /**
   * function create new user
   * if email exist return json with key `{"message": "Email in use"}` and status 400
   * otherwise return json with key `{"token": "exampletoken", "user": {"email": "example@email.com", "subscription": "free"}}` and send status 201
   */
  async _createUser(req, res) {
    try{
      const {email, password} = await req.body;
      
      const existingEmail = await userModel.findUserByEmail(email);
      if(existingEmail) return res.status(400).json({message: "Email in use"});
      
      const passwordHash = await bcryptjs.hash(password, this._costFactor);
      const newUser = await userModel.create({email, password: passwordHash});

      const updatedUser = await userModel.updateToken(newUser._id);

      res.status(201).json({
        token: updatedUser.token, 
        user: { 
          email: updatedUser.email, 
          subscription: updatedUser.subscription
        }
      });
    } catch {
      res.sendStatus(400);
    }
  }


  /**
   * function find user by email
   * if user is not exist return 'Bad request'
   * if password is not valid return json with key `{"message": "Wrong login or password"}` and send status 400
   * otherwise compares the password of the found user, if the password matches creates a token, saves in the current user and return json key  `{"token": "example token", "user": {"email": "email", "subscription": "free"}}` and send status 200
   */
  async userLogin(req, res) {
    try{
      const {email, password} = req.body;

      const user = await userModel.findUserByEmail(email);
      if(!user) return res.sendStatus(401);
      
      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if(!isPasswordValid) return res.status(400).json({message: "Wrong login or password"});

      const updatedUser = await userModel.updateToken(user._id);
      
      return res.status(200).json({
        token: updatedUser.token, 
        user: {
          email: updatedUser.email,
          subscription: updatedUser.subscription
        }
      });

    } catch {
      res.sendStatus(400);
    }
  }


  /**
   * function is middleware for validate token
   * take token from headers `Athorization` and validates
   * if token is valide take user id from token, find user in database by this id
   * if user exists, write its user data to req.user and call next() 
   * if user id doesn`t exist return json with key {"message": "Not authorized"} and send status 401
   */
  async userAuth(req, res, next) {
    try {
      const authHeader = req.get("Authorization");
      const token = authHeader.replace("Bearer ", "");
      
      const userId = await userModel.verifyToken(token);
      if(!userId) return res.status(401).json({message: "Not authorized"});
      
      const user = await userModel.findById(userId);
      if(!user || user.token !== token) return res.status(401).json({message: "Not authorized"})
      
      req.user = user;

      next();
    } catch (err) {
      res.sendStatus(400);
    }
  }


  /**
   * function logout user
   * find user by id in user model
   * if user dosen`t exist return json wuth key `{"message": "Not authorized"}` and send status 401
   * otherwise delete token in current user and return json with key `{"message": "Logout success"}` and send status 200
   */
  async userLogout(req, res) {
    try {
      const user = req.user;
      await userModel.deleteToken(user._id);

      return res.status(200).json({message: "Logout success"});
    } catch(err) {
      res.status(401).json({message: "Not authorized"});
    }
  };


  /**
   * function take current user data
   * if user exists return json with key `{"email": "example@email.com", "subscription": "free"}` and send status 200
   */
  async getCurrentUser(req, res) {
    try {
      const {email, subscription} = req.user;
      
      res.status(200).json({email, subscription});
    } catch (err) {
      res.sendStatus(400);
    }
  };


  /**
   * function update user subscription by email
   * if user doesn`t exist return json wuth key `{"message": "Not authorized"}` and send status 401
   * otherwise update field "subscription" in current user and return json with key `{"email": "updatedUserEmail", "subscription": "updatedUserSubscription"}` and send status 200
   */
  async updateDataUsers(req, res) {
    try {
      const {email} = req.body;
      const {sub} = req.query;

      const user = await userModel.findUserByEmail(email);

      if(!user || !sub ) return res.sendStatus(401);

      const updatedUser = await userModel.findByIdAndUpdate(user._id, {subscription: sub}, {runValidators: true, new: true});

      return res.status(200).json({
          email: updatedUser.email,
          subscription: updatedUser.subscription
      });
    } catch {
      res.sendStatus(400);
    }
  }


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
      res.status(422).json({message:"Missing required fields"});
    }
  };


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
      res.status(422).json({message:"Missing required fields"});
    }
  };
  

  /**
   * validation parameters ID of user
   * if user id is invalid return json with key `{"message": "missing fields"}` and send status 400
   */
  async validateId(req, res, next) {
    const userId = req.user._id;

    if (!ObjectId.isValid(userId)) return res.status(400).json({message: "missing fields"});

    next()
  }
};

module.exports = new UserController();