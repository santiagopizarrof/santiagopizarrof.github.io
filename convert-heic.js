const fs = require("fs");
const path = require("path");
const convert = require("heic-convert");

const dir = path.join(__dirname, "assets", "photos");

async function run() {
  const files = fs.readdirSync(dir).filter((f) => /\.heic$/i.test(f));
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(dir, file.replace(/\.heic$/i, ".jpg"));
    console.log("converting", file);
    const inputBuffer = fs.readFileSync(inputPath);
    const outputBuffer = await convert({ buffer: inputBuffer, format: "JPEG", quality: 0.88 });
    fs.writeFileSync(outputPath, outputBuffer);
    console.log("done ->", path.basename(outputPath));
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
