const { Router } = require('express');

const {
    userSignUp,
    userLogin,
    userAuth,
    userLogout,
    validateUserKeys,
    validateId
} = require('./user.controller');

const router = Router();

router.post('/register', validateUserKeys, userSignUp);
router.post('/login', validateUserKeys, userLogin);
router.post('/logout', userAuth, validateId, userLogout);

module.exports = router;