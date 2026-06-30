import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const platformArg = process.argv[2];
const platforms = platformArg ? [platformArg] : ["ios", "android"];
const root = process.cwd();
const delayMs = Number(process.env.SCREENSHOT_DELAY_MS ?? 1800);
const adbPath = findAdb();

const screens = [
  ["onboarding", "start"],
  ["home", ""],
  ["map", "map"],
  ["waterbody-detail", "map"],
  ["fish-detail", "fish/rainbow-trout"],
  ["rig-builder", "rigs"],
  ["trip-planner", "plan"],
  ["trip-log", "log"],
  ["fishing-stats", "stats"],
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

function findAdb() {
  const candidates = [
    process.env.ADB,
    process.env.ANDROID_HOME ? join(process.env.ANDROID_HOME, "platform-tools", "adb") : undefined,
    process.env.ANDROID_SDK_ROOT ? join(process.env.ANDROID_SDK_ROOT, "platform-tools", "adb") : undefined,
    join(homedir(), "Library", "Android", "sdk", "platform-tools", "adb"),
    "adb"
  ].filter(Boolean);
  return candidates.find((candidate) => candidate === "adb" || existsSync(candidate)) ?? "adb";
}

function openRoute(platform, route) {
  const expoUrl = process.env.EXPO_URL;
  const url = expoUrl
    ? `${expoUrl.replace(/\/$/, "")}/--/${route}`
    : route
      ? `unskunked://${route}`
      : "unskunked://";
  if (platform === "ios") {
    run("xcrun", ["simctl", "openurl", "booted", url]);
    return;
  }
  run(adbPath, ["shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", url]);
}

function capture(platform, filename) {
  const dir = join(root, "screenshots", platform);
  mkdirSync(dir, { recursive: true });
  const output = join(dir, filename);
  if (platform === "ios") {
    run("xcrun", ["simctl", "io", "booted", "screenshot", output]);
    return;
  }
  const png = execFileSync(adbPath, ["exec-out", "screencap", "-p"], { maxBuffer: 12 * 1024 * 1024 });
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
    if (platform === "android" && name === "home") {
      run(adbPath, ["shell", "am", "force-stop", "host.exp.exponent"]);
      openRoute(platform, "");
      sleep(delayMs);
    } else {
      openRoute(platform, route);
    }
    sleep(delayMs);
    capture(platform, filename);
  }
}
