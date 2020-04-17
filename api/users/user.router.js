const { Router } = require('express');

const {
    userSignUp,
    userLogin,
    userAuth,
    userLogout,
    validateCreatedUser,
    validateSignInUser,
    validateId
} = require('./user.controller');

const router = Router();

router.post('/register', validateCreatedUser, userSignUp);
router.post('/login', validateSignInUser, userLogin);
router.post('/logout', userAuth, validateId, userLogout);

module.exports = router;