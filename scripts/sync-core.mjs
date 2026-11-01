#!/usr/bin/env node
// 把平台无关的 @xcyh/core 同步到 Cocos assets 目录。
// Cocos 的 asset-db 只认识 assets/ 下的文件，因此需要一个显式同步步骤。

import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = resolve(root, 'packages/core/src');
const dstDir = resolve(root, 'apps/cocos/assets/scripts/core');
const files = ['types.ts', 'data.ts', 'engine.ts'];

mkdirSync(dstDir, { recursive: true });

for (const file of files) {
  const src = resolve(srcDir, file);
  const dst = resolve(dstDir, file);
  let content = readFileSync(src, 'utf8');
  content = content
    .replaceAll("from './types.js'", "from './types'")
    .replaceAll("from './data.js'", "from './data'");
  writeFileSync(dst, content, 'utf8');
  console.log(`synced ${file}`);
}

console.log(`\ncore synced to ${dstDir}`);
