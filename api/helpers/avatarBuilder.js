const Avatar = require('avatar-builder');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const squareAvatar = Avatar.squareBuilder(128);
const maleAvatar = Avatar.male8bitBuilder(128);
const femaleAvatar = Avatar.female8bitBuilder(128);

module.exports = async function generateAvatar(req, _, next) {
    try {
        const {email, name} = req.body;
        const avatarName = 'avatar-' + Date.now() + '.png';
        const uniqueName = name ? name.split(' ')[0] : email.split('@')[0];
        const destination = path.join(__dirname, '..', '..', 'tmp');
        const tmpPath = path.join(destination, avatarName);
  
        const validateGenderURL = `https://api.genderize.io/?name=${uniqueName}`;
  
        const gender = await fetch(validateGenderURL).then(res => res.json()).then(data => data.gender);
    
        if(!gender) await squareAvatar.create(uniqueName).then(buffer => fs.writeFileSync(tmpPath, buffer));
        if(gender === 'male') await maleAvatar.create(uniqueName).then(buffer => fs.writeFileSync(tmpPath, buffer));
        if(gender === 'female') await femaleAvatar.create(uniqueName).then(buffer => fs.writeFileSync(tmpPath, buffer));
    
        req.file = {
            fieldname: 'avatar',
            mimetype: 'image/png',
            destination,
            filename: avatarName,
            path: tmpPath
        };

        next();
    } catch(err) {
        next(err);
    }

  }