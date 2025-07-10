const fs = require('fs');
const path = require('path');
const ttf2woff = require('ttf2woff');

const FONT_DIR = path.join(__dirname, '../src/assets/fonts');
const SCSS_FONT_FILE = path.join(__dirname, '../src/styles/_fonts.scss');

let fontFaces = [];

async function walk(dir, callback) {
  for (const file of fs.readdirSync(dir)) {
    const filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      await walk(filepath, callback);
    } else {
      await callback(filepath);
    }
  }
}

async function convertFont(fontPath) {
  const ext = path.extname(fontPath).toLowerCase();
  if (ext !== '.ttf' && ext !== '.otf') return;
  const fontData = fs.readFileSync(fontPath);
  const woffPath = fontPath.replace(ext, '.woff');
  const woff2Path = fontPath.replace(ext, '.woff2');

  // WOFF
  if (!fs.existsSync(woffPath)) {
    const woff = ttf2woff(fontData);
    fs.writeFileSync(woffPath, Buffer.from(woff.buffer));
    console.log('Created', woffPath);
  }
  // WOFF2 (dynamic import)
  if (!fs.existsSync(woff2Path)) {
    const ttf2woff2 = (await import('ttf2woff2')).default;
    const woff2 = ttf2woff2(fontData);
    fs.writeFileSync(woff2Path, woff2);
    console.log('Created', woff2Path);
  }

  // Генерация @font-face
  const relFontPath = path.relative(path.join(__dirname, '../src/styles'), fontPath).replace(/\\/g, '/');
  const fontName = path.basename(fontPath, ext);
  const fontDir = path.dirname(relFontPath).replace('assets/fonts', 'assets/fonts');
  const woffRel = relFontPath.replace(ext, '.woff');
  const woff2Rel = relFontPath.replace(ext, '.woff2');
  fontFaces.push(`@font-face {\n  font-family: '${fontName}';\n  src: url('../${woff2Rel}') format('woff2'), url('../${woffRel}') format('woff');\n  font-weight: normal;\n  font-style: normal;\n}`);
}

(async () => {
  await walk(FONT_DIR, convertFont);
  // Записываем _fonts.scss
  if (fontFaces.length) {
    fs.writeFileSync(SCSS_FONT_FILE, fontFaces.join('\n\n'));
    console.log('Generated', SCSS_FONT_FILE);
  }
})(); 