const Avatar = require('avatar-builder');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const squareAvatar = Avatar.squareBuilder(360);
const maleAvatar = Avatar.male8bitBuilder(360);
const femaleAvatar = Avatar.female8bitBuilder(360);

class avatarGenerator {

    get createAvatar() {
        return this._createAvatar.bind(this);
    }

    async _createAvatar(req, _, next) {
        try {
            const { email, name } = req.body;
            const avatarName = 'avatar-' + Date.now() + '.png';
            const uniqueName = name ? name.split(' ')[0] : email.split('@')[0];
            const destination = path.join(__dirname, '..', '..', 'tmp');
            const tmpPath = path.join(destination, avatarName);
            
            const gender = await this.checkGender.call(avatarGenerator, uniqueName);

            const chengerOpts = {
                gender,
                name: uniqueName,
                path: tmpPath
            }

            await this.changeAvatar.call(avatarGenerator, chengerOpts);

            req.file = {
                fieldname: 'avatar',
                mimetype: 'image/png',
                destination,
                filename: avatarName,
                path: tmpPath
            };

            next();
        } catch (err) {
            next(err);
        }
    }
 
    checkGender = async (uniqueName) => {
        const validateGenderURL = `https://api.genderize.io/?name=${uniqueName}`;

        return await fetch(validateGenderURL).then(res => res.json()).then(data => data.gender);
    }

    changeAvatar = async ({gender, name, path}) => {
        if (!gender) await squareAvatar.create(name).then(buffer => fs.writeFileSync(path, buffer));
        if (gender === 'male') await maleAvatar.create(name).then(buffer => fs.writeFileSync(path, buffer));
        if (gender === 'female') await femaleAvatar.create(name).then(buffer => fs.writeFileSync(path, buffer));
    }

}

module.exports = new avatarGenerator();