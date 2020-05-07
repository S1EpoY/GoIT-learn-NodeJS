const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const minifyIMG = require('../helpers/imagemin');
const {createAvatar} = require('../helpers/avatarBuilder');

const {
    userSignUp,
    userLogin,
    userAuth,
    userLogout,
    confirmedEmail,
    confirmedEmailUsingLink
} = require('./user.controller');

const {
    validateKeys,
    validateId,
    validateEmail,
    checkEmailForMatch,
    checkEmailForUniqueness,
    validateAndRedirectURL
} = require('./user.validator')

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
router.post(
    '/register', 
    validateKeys, 
    checkEmailForUniqueness, 
    checkEmailForMatch, 
    upload.single('avatar'), 
    createAvatar, 
    minifyIMG, 
    userSignUp
    );

router.post('/login', validateKeys, userLogin);
router.post('/logout', userAuth, validateId, userLogout);

router.get('/otp/:otpCode', validateAndRedirectURL, confirmedEmailUsingLink);
router.post('/otp/:otpCode', validateEmail, confirmedEmail);

module.exports = router;