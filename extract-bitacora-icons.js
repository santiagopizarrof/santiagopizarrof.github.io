const path = require("path");
const { Jimp, intToRGBA } = require("jimp");

const src = path.join(__dirname, "assets", "icons", "iconos_bitacora.jpg");
const outDir = path.join(__dirname, "assets", "icons");

// row-band centers detected via pixel scan, ~140px diameter circles
const circles = [
  { name: "icon-leaf-bit1", cy: 131 },
  { name: "icon-leaf-bit2", cy: 395 },
  { name: "icon-leaf-bit3", cy: 635 },
  { name: "icon-leaf-bit4", cy: 884 },
];
const cx = 403;
const cropSize = 160;

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
}

async function run() {
  const source = await Jimp.read(src);
  for (const circle of circles) {
    const cropped = source.clone().crop({
      x: cx - cropSize / 2,
      y: circle.cy - cropSize / 2,
      w: cropSize,
      h: cropSize,
    });

    // sample background (sage) color from a corner, well outside the circle
    const bg = intToRGBA(cropped.getPixelColor(2, 2));

    const t1 = 20;
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
    });

    const outPath = path.join(outDir, `${circle.name}.png`);
    await cropped.write(outPath);
    console.log("wrote", outPath);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
