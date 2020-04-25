const { Router } = require('express');
const multer = require('multer');
const path = require('path');
const minifyIMG = require('../helpers/imagemin');

const {
    userAuth,
    getCurrentUser, 
    updateUserSubscription,
    updateUserIMG,
    checkAndDelPrevIMG
} = require('./user.controller');

const {
    validateUserSubData,
    validateUserId,
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
 * routs with path '/users'
 */
router.patch('/avatars', userAuth, upload.single('avatar'), checkAndDelPrevIMG, minifyIMG, updateUserIMG);
router.patch('/', userAuth, validateUserSubData, updateUserSubscription); 
router.get('/current', userAuth, validateUserId, getCurrentUser);

module.exports = router;