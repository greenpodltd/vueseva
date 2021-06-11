#!/usr/bin/env node

function run() {
  const argv = process.argv.slice(2);
  if (argv[0] === "dev") {
    console.log("dev");
  }
}

run();
