import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const targets = [
  { svg: "assets/skunked-icon.svg", png: "assets/icon.png", size: 1024 },
  { svg: "assets/skunked-adaptive-icon.svg", png: "assets/adaptive-icon.png", size: 1024 },
  { svg: "assets/skunked-splash.svg", png: "assets/splash.png", width: 1242, height: 2436 },
  { svg: "assets/store-graphic.svg", png: "assets/store-graphic.png", width: 1800, height: 1200 },
  { svg: "assets/skunked-icon.svg", png: "assets/favicon.png", size: 512 }
];

for (const target of targets) {
  const input = join(root, target.svg);
  const output = join(root, target.png);
  const width = target.width ?? target.size;
  const height = target.height ?? target.size;
  await sharp(input).resize(width, height).png().toFile(output);
  console.log(`Wrote ${target.png} (${width}x${height}) from ${target.svg}`);
}
