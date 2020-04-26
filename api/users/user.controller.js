const bcryptjs = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const userModel = require('./user.model');
const contactModel = require('../contacts/contact.model');

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
      const {email, password, name, contactId} = await req.body;
      
      const passwordHash = await bcryptjs.hash(password, this._costFactor);
      const newUser = await userModel.create({
        email, 
        password: passwordHash, 
        avatarURL: `${process.env.BASE_URL}images/${req.file.filename}`
      });

      const {_id, subscription} = newUser

      if(contactId) await contactModel.findByIdAndUpdate(contactId, {user: {subscription, userId: _id}}, {new: true});

      const updatedUser = await userModel.updateToken(_id, name, contactId);

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
      if(!user || user.token !== token) return res.status(401).json({message: "Not authorized"});
      
      req.user = user;

      next();
    } catch (err) {
      next(err);
    }
  }


  /**
   * function logout user
   * find user by id in user model
   * if user dosen`t exist return json with key `{"message": "Not authorized"}` and send status 401
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
   * update field "subscription" in current user and return json with key `{"email": "updatedUserEmail", "subscription": "updatedUserSubscription"}` and send status 200
   * if user doesn`t exist return json with key `{"message": "Not authorized"}` and send status 401
   */
  async updateUserSubscription(req, res) {
    try {
      const {email, subscription} = req.body;
      
      const user = await userModel.findUserByEmail(email);
      
      if(!user || !subscription ) return res.sendStatus(401);
      
      const existingContact = await contactModel.findOne({email});
      if(existingContact) await contactModel.findByIdAndUpdate(existingContact._id, {user: {subscription}});

      const updatedUser = await userModel.findUserByIdAndUpdate(user._id, {subscription});

      return res.status(200).json({
          email: updatedUser.email,
          subscription: updatedUser.subscription
      });
    } catch {
      res.sendStatus(400);
    }
  }
  

  /**
   * function is middleware for delete previous avatar-image before added next
   * take object 'user' from request which should have field 'avaterURL'
   */
  checkAndDelPrevIMG(req, _, next) {
    try {
      const {avatarURL} = req.user;

      const avatarName = avatarURL.split('/images/')[1];
      const avatarPath = path.join(__dirname, '..', 'public', 'images', avatarName);

      if(avatarURL) fs.promises.unlink(avatarPath);

      next();
    } catch(err) {
      next(err);
    }
  };
  

  /**
   * function update path to user avatar
   * update field 'avatarURL' in current user and return json with key {'avatarURL': 'exemple.URL'} and sen status 200
   */
  async updateUserIMG(req, res) {
    try {
      const avatarURL = `${process.env.BASE_URL}images/${req.file.filename}`
      const updatedUser = await userModel.findUserByIdAndUpdate(req.user._id, {avatarURL});

      res.status(200).json({
        avatarURL: updatedUser.avatarURL
      });
    } catch(err) {
      res.sendStatus(400);
    }
  }
};

module.exports = new UserController();