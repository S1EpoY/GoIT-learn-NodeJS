const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const minifyIMG = require('../helpers/imagemin');
const generateAvatar = require('../helpers/avatarBuilder');

const {
    userSignUp,
    userLogin,
    userAuth,
    userLogout
} = require('./user.controller');

const {
    validateUserKeys,
    validateUserId,
    validateUserEmail
} = require('../helpers/validator')

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'tmp'),
    filename: function (_, file, cb) {
        const ext = path.parse(file.originalname).ext
        cb(null, 'avatar-' + Date.now() + ext)
    }
});

const upload = multer({ storage });
upload.single('avatar')

const router = Router();

/**
 * routs with path '/auth'
 */
router.post('/register', validateUserKeys, validateUserEmail, upload.single('avatar'), generateAvatar, minifyIMG, userSignUp);
router.post('/login', validateUserKeys, userLogin);
router.post('/logout', userAuth, validateUserId, userLogout);

module.exports = router;