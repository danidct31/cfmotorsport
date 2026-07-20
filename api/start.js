#!/usr/bin/env node
/**
 * Railway start script: migrate + seed (best effort), then boot the API.
 */
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(label, command, args) {
  console.log(`\n→ ${label}: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    env: process.env,
    shell: false,
  });
  if (result.status !== 0) {
    console.warn(`⚠ ${label} failed (exit ${result.status}). Continuing…`);
    return false;
  }
  console.log(`✓ ${label} ok`);
  return true;
}

console.log('Lisa API starting…');
console.log(
  'DATABASE_URL:',
  process.env.DATABASE_URL ? 'set' : 'MISSING — migrate/seed will fail',
);

if (process.env.DATABASE_URL) {
  run('prisma migrate', 'npx', ['prisma', 'migrate', 'deploy']);
  run('seed', 'node', ['prisma/seed.js']);
} else {
  console.warn('⚠ Skipping migrate/seed — DATABASE_URL is empty');
}

const candidates = [
  path.join(__dirname, 'dist', 'main.js'),
  path.join(__dirname, 'dist', 'src', 'main.js'),
];

const mainJs = candidates.find((file) => fs.existsSync(file));

if (!mainJs) {
  console.error('✗ Could not find compiled main.js');
  console.error(
    'dist contents:',
    fs.existsSync('dist') ? fs.readdirSync('dist') : 'no dist/',
  );
  process.exit(1);
}

console.log(`\n→ starting ${mainJs}`);
require(mainJs);
