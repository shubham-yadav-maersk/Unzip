const chokidar = require("chokidar");
const AdmZip = require("adm-zip");
const path = require("path");
const fs = require("fs");
const os = require("os");

const DOWNLOADS = path.join(os.homedir(), "Downloads");

// ── Wait until the file is fully written ──────────────────────
function waitForFile(filePath, timeoutMs = 30000) {
  return new Promise((resolve, reject) => {
    let prevSize = -1;
    let elapsed = 0;

    const check = setInterval(() => {
      try {
        const stat = fs.statSync(filePath);
        if (stat.size === prevSize && stat.size > 0) {
          clearInterval(check);
          resolve(true);
        }
        prevSize = stat.size;
      } catch {
        // file might not exist yet
      }

      elapsed += 1000;
      if (elapsed >= timeoutMs) {
        clearInterval(check);
        reject(new Error("Timeout waiting for file to finish downloading"));
      }
    }, 1000);
  });
}

// ── Extract the zip ───────────────────────────────────────────
async function extractZip(filePath) {
  try {
    console.log(`\n⏳ Waiting for download to finish...`);
    await waitForFile(filePath);

    const extractFolder = filePath.replace(/\.zip$/i, "");
    if (!fs.existsSync(extractFolder)) {
      fs.mkdirSync(extractFolder, { recursive: true });
    }

    console.log(`📦 Extracting: ${path.basename(filePath)}`);

    const zip = new AdmZip(filePath);
    zip.extractAllTo(extractFolder, true); // true = overwrite

    console.log(`✅ Done → ${extractFolder}`);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}

// ── Watch the Downloads folder ────────────────────────────────
console.log(`👀 Watching: ${DOWNLOADS}`);
console.log(`Drop any .zip file there. Press Ctrl+C to stop.\n`);

const watcher = chokidar.watch(DOWNLOADS, {
  ignored: /(^|[\/\\])\../,   // ignore hidden files
  persistent: true,
  ignoreInitial: true,         // don't extract old zips on startup
  awaitWriteFinish: {          // wait until file stops changing
    stabilityThreshold: 2000,
    pollInterval: 500,
  },
});

watcher.on("add", (filePath) => {
  if (filePath.toLowerCase().endsWith(".zip")) {
    extractZip(filePath);
  }
});

// Handles browser renaming .crdownload → .zip
watcher.on("change", (filePath) => {
  if (filePath.toLowerCase().endsWith(".zip")) {
    extractZip(filePath);
  }
});