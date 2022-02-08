const Jimp = require('jimp');
const ora = require('ora');

// You can tweak unicode ranges and pictures sizes here
const IMAGE_SIZE = 32; // generated picture size in px

// Available fonts:
// Jimp.FONT_SANS_8_BLACK; // Open Sans, 8px, black
// Jimp.FONT_SANS_10_BLACK; // Open Sans, 10px, black
// Jimp.FONT_SANS_12_BLACK; // Open Sans, 12px, black
// Jimp.FONT_SANS_14_BLACK; // Open Sans, 14px, black
// Jimp.FONT_SANS_16_BLACK; // Open Sans, 16px, black
// Jimp.FONT_SANS_32_BLACK; // Open Sans, 32px, black
// Jimp.FONT_SANS_64_BLACK; // Open Sans, 64px, black
// Jimp.FONT_SANS_128_BLACK; // Open Sans, 128px, black
const FONT = Jimp.FONT_SANS_16_BLACK; // Font to use (built-in one, Open Sans )

// Unicode range used to generated pictures
const UNICODE_START_RANGE = 0
const UNICODE_END_RANGE = 917631; // Max unicode code

const createImage = () => new Promise((resolve, reject) => {
  new Jimp(IMAGE_SIZE, IMAGE_SIZE, 0xFFFFFFFF, (error, image) => {
    if (error) reject(error);
    resolve(image)
  });
});

// used to ignore invisible characters (can be updated with missing invisible chars)
const isInvisibleChar = (character) => {
  return /[\u0000-\u0020\u007F-\u009F\u200B\u200e]/g.test(character);
};

const main = async () => {
  if (UNICODE_END_RANGE <= UNICODE_START_RANGE) {
    throw new Error('UNICODE_END_RANGE should be strictly greater than UNICODE_START_RANGE');
  }
  const spinner = ora('Generating characters pictures 0%').start();
  const font = await Jimp.loadFont(FONT);
  for(let i = UNICODE_START_RANGE; i < UNICODE_END_RANGE; ++i) {
    let printableString = String.fromCodePoint(i);
    // If the character is not printable (invisible), ignore it
    if (isInvisibleChar(printableString)) continue;

    const image = await createImage();
    image.opaque();
    image.print(font, 0, 0, {
      text: printableString,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, IMAGE_SIZE, IMAGE_SIZE);

    await image.writeAsync(`out/pic_${i}.png`);
    
    const currentPercent =  Math.floor((i / (UNICODE_END_RANGE - UNICODE_START_RANGE)) * 10000) / 100;
    spinner.text = `Generating character picture ${printableString} - ${currentPercent}%`;
  }
  spinner.succeed('Done !');
};

main();