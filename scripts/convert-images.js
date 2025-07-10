const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const IMG_DIR = path.join(__dirname, '../src/assets/images');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(file => {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walk(filepath, callback);
    } else {
      callback(filepath);
    }
  });
}

function convertToWebp(imgPath) {
  const ext = path.extname(imgPath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;
  const webpPath = imgPath.replace(ext, '.webp');
  if (fs.existsSync(webpPath)) return; // не перезаписывать
  sharp(imgPath)
    .webp({ quality: 80 })
    .toFile(webpPath)
    .then(() => console.log('Created', webpPath))
    .catch(err => console.error('Error converting', imgPath, err));
}

walk(IMG_DIR, convertToWebp); 