#!/usr/bin/env node
const path = require("path");
const fs = require("fs-extra");
const fg = require("fast-glob");

const rootDir = path.resolve(__dirname, "..");
const appDir = process.cwd();
const appDestination = path.resolve(appDir, "src/.vueseva");
const templateDir = path.resolve(rootDir, "template");
async function run() {
  const argv = process.argv.slice(2);

  if (argv[0] === "dev") {
    // Create output directory
    if (!fs.existsSync(appDestination)) {
      await fs.mkdirp(appDestination);
    }

    const entries = await fg(`${templateDir}/**/*.{js,ts,vue,html}`, {
      absolute: true,
    });

    await Promise.all(
      entries.map((entry) => {
        const dstEntry = entry.replace(templateDir, appDestination);
        return fs.copy(entry, dstEntry);
      })
    );
  }
}

run();
