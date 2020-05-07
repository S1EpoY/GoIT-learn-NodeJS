const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const path = require('path');
const fs = require('fs');

module.exports = async function minifyIMG(req, _, next) {
    try {
        const {filename, path: tmpPath} = req.file;

        const MINIFIED_DIR = path.join(__dirname, '..', 'public', 'images');
        const MINIFIED_FILE_DIR = path.join(MINIFIED_DIR, filename);
        
        await imagemin(['tmp'], {
            destination: 'api/public/images',
            plugins: [
                imageminJpegtran(),
                imageminPngquant({  
                    quality: [0.3, 0.8]
                })
            ]
        });

        fs.promises.unlink(tmpPath);

        req.file = {
            ...req.file,
            path: MINIFIED_FILE_DIR,
            destination: MINIFIED_DIR
        }

        next();
    } catch(err) {
        next(err);
    }
};