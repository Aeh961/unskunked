import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const platformArg = process.argv[2];
const platforms = platformArg ? [platformArg] : ["ios", "android"];
const root = process.cwd();
const delayMs = Number(process.env.SCREENSHOT_DELAY_MS ?? 1800);
const adbPath = findAdb();

// Deep-link-reachable static routes only. Interaction states the spec also wants
// (autocomplete while typing, the Ask conversation, a generated trip summary) can't be
// produced by this script - it only opens routes and screenshots them, it doesn't type
// into inputs or tap buttons. Those need to be captured manually on a running simulator.
const screens = [
  ["home", ""],
  ["trips-empty-state", "trips"],
  // The Map screen is a single unified region selector + map + result-list view now (no
  // separate "nearby waterbodies" section) - one static-route screenshot represents it;
  // GPS-granted/denied and a specific selected waterbody/shellfish card need manual capture.
  ["map", "map"],
  ["species", "species"],
  ["fish-detail", "fish/rainbow-trout"],
  ["ask", "ask"],
  ["more", "more"],
  ["regulations", "regulations"],
  ["weather", "weather"],
  ["tides", "weather"],
  ["offline-mode", "offline"],
  ["search", "search"],
  ["fishing-journal", "journal"],
  ["rig-builder", "rigs"],
  ["beta-insights", "insights"],
  ["settings", "settings"],
  ["data-sources", "data-sources"],
  ["favorites", "favorites"],
  ["fishing-stats", "stats"],
  ["learning-center", "learn"],
  ["start-here", "start"],
  ["about", "about"]
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
