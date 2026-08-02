#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(label, command, args) {
  console.log(`\n→ ${label}`);
  const result = spawnSync(command, args, { stdio: 'inherit', env: process.env });
  if (result.status !== 0) {
    console.warn(`⚠ ${label} failed (exit ${result.status}). Continuing…`);
    return false;
  }
  return true;
}

console.log('CF Motorsport API starting…');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'MISSING');

if (process.env.DATABASE_URL) {
  run('migrate', 'npx', ['prisma', 'migrate', 'deploy']);
}

const candidates = [
  path.join(__dirname, 'dist', 'main.js'),
  path.join(__dirname, 'dist', 'src', 'main.js'),
];
const mainJs = candidates.find((f) => fs.existsSync(f));
if (!mainJs) {
  console.error('Missing compiled main.js');
  process.exit(1);
}
require(mainJs);
