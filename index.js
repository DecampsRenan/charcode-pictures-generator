const Jimp = require('jimp');
const ora = require('ora');

const IMAGE_SIZE = 32; // generated picture size in px
const FONT = Jimp.FONT_SANS_16_BLACK;
const UNICODE_RANGE_MAX = 917631;

const createImage = () => new Promise((resolve, reject) => {
  new Jimp(IMAGE_SIZE, IMAGE_SIZE, 0xFFFFFFFF, (error, image) => {
    if (error) reject(error);
    resolve(image)
  });
});

const isInvisibleChar = (character) => {
  return /[\u0000-\u0020\u007F-\u009F\u200B\u200e]/g.test(character);
};

const main = async () => {
  const spinner = ora('Generating characters pictures 0%').start();
  const font = await Jimp.loadFont(FONT);
  for(let i = 0; i < UNICODE_RANGE_MAX; ++i) {
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
    const currentPercent =  Math.floor((i / UNICODE_RANGE_MAX) * 10000) / 100;
    spinner.text = `Generating character picture ${printableString} - ${currentPercent}%`;
  }
  spinner.succeed('Done !');
};

main();