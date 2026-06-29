import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const platformArg = process.argv[2];
const platforms = platformArg ? [platformArg] : ["ios", "android"];
const root = process.cwd();
const delayMs = Number(process.env.SCREENSHOT_DELAY_MS ?? 1800);

const screens = [
  ["home", ""],
  ["map", "map"],
  ["waterbody-detail", "map"],
  ["fish-list", "fish"],
  ["fish-detail", "fish/rainbow-trout"],
  ["rig-builder", "rigs"],
  ["rig-diagram", "rigs"],
  ["ask-unskunked", "ask"],
  ["trip-log", "log"],
  ["favorites", "favorites"],
  ["learning-center", "learn"],
  ["settings", "settings"]
];

function sleep(ms) {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function run(command, args) {
  execFileSync(command, args, { stdio: "inherit" });
}

function openRoute(platform, route) {
  const url = route ? `unskunked://${route}` : "unskunked://";
  if (platform === "ios") {
    run("xcrun", ["simctl", "openurl", "booted", url]);
    return;
  }
  run("adb", ["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", url]);
}

function capture(platform, filename) {
  const dir = join(root, "screenshots", platform);
  mkdirSync(dir, { recursive: true });
  const output = join(dir, filename);
  if (platform === "ios") {
    run("xcrun", ["simctl", "io", "booted", "screenshot", output]);
    return;
  }
  const png = execFileSync("adb", ["exec-out", "screencap", "-p"]);
  writeFileSync(output, png);
}

for (const platform of platforms) {
  if (!["ios", "android"].includes(platform)) {
    throw new Error(`Unknown platform "${platform}". Use ios, android, or omit for both.`);
  }
  mkdirSync(join(root, "screenshots", platform), { recursive: true });
  for (const [name, route] of screens) {
    const filename = `${platform}-${name}.png`;
    console.log(`Capturing ${filename}`);
    openRoute(platform, route);
    sleep(delayMs);
    capture(platform, filename);
  }
}
