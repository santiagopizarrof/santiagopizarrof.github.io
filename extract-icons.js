const path = require("path");
const { Jimp, intToRGBA, rgbaToInt } = require("jimp");

const srcDir = path.join(__dirname, "assets", "photos", "animales y plantas");
const outDir = path.join(__dirname, "assets", "icons");
require("fs").mkdirSync(outDir, { recursive: true });

const sheets = [
  {
    file: "watermarked_img_12410018133171994950.jpg",
    cells: [
      { name: "icon-mushroom", col: 0, row: 0 },
      { name: "icon-daisy", col: 1, row: 0 },
      { name: "icon-daffodil", col: 0, row: 1 },
      { name: "icon-whale", col: 1, row: 1 },
    ],
  },
  {
    file: "watermarked_img_8821391725900257160.jpg",
    cells: [
      { name: "icon-fox", col: 0, row: 0 },
      { name: "icon-dragonfly2", col: 1, row: 0 },
      { name: "icon-horse", col: 0, row: 1 },
      { name: "icon-cat", col: 1, row: 1 },
    ],
  },
];

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

async function processCell(image, cell, cellW, cellH) {
  const x0 = cell.col * cellW;
  const y0 = cell.row * cellH;
  const cropped = image.clone().crop({ x: x0, y: y0, w: cellW, h: cellH });

  const bg = intToRGBA(cropped.getPixelColor(2, 2));

  const t1 = 18;
  const t2 = 55;

  cropped.scan(0, 0, cropped.bitmap.width, cropped.bitmap.height, (x, y, idx) => {
    const r = cropped.bitmap.data[idx + 0];
    const g = cropped.bitmap.data[idx + 1];
    const b = cropped.bitmap.data[idx + 2];
    const dist = colorDistance(r, g, b, bg.r, bg.g, bg.b);
    let alpha;
    if (dist <= t1) alpha = 0;
    else if (dist >= t2) alpha = 255;
    else alpha = Math.round(((dist - t1) / (t2 - t1)) * 255);
    cropped.bitmap.data[idx + 3] = alpha;
    if (alpha > 0) {
      cropped.bitmap.data[idx + 0] = 246;
      cropped.bitmap.data[idx + 1] = 241;
      cropped.bitmap.data[idx + 2] = 226;
    }
  });

  return cropped;
}

async function run() {
  for (const sheet of sheets) {
    const image = await Jimp.read(path.join(srcDir, sheet.file));
    const cellW = Math.floor(image.bitmap.width / 2);
    const cellH = Math.floor(image.bitmap.height / 2);
    for (const cell of sheet.cells) {
      const result = await processCell(image, cell, cellW, cellH);
      const outPath = path.join(outDir, `${cell.name}.png`);
      await result.write(outPath);
      console.log("wrote", outPath);
    }
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
