const fs = require("fs");
const path = require("path");
const { Jimp } = require("jimp");

const dir = path.join(__dirname, "assets", "photos");
const maxDim = 1600;

async function run() {
  const files = fs.readdirSync(dir).filter((f) => /^foto\d+\.(jpg|png)$/i.test(f));
  for (const file of files) {
    const filePath = path.join(dir, file);
    const before = fs.statSync(filePath).size;
    const buffer = fs.readFileSync(filePath);
    const image = await Jimp.fromBuffer(buffer, { "image/jpeg": { maxMemoryUsageInMB: 1024 } });
    const { width, height } = image.bitmap;
    if (Math.max(width, height) > maxDim) {
      if (width > height) image.resize({ w: maxDim });
      else image.resize({ h: maxDim });
    }
    await image.write(filePath, { quality: 82 });
    const after = fs.statSync(filePath).size;
    console.log(file, `${(before / 1024 / 1024).toFixed(1)}MB -> ${(after / 1024 / 1024).toFixed(1)}MB`);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
