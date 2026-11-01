#!/usr/bin/env node
// 把微信小游戏 AppID 写入 Cocos 构建产物的 project.config.json。
// Cocos 默认会写入一个示例 AppID，微信开发者工具无法识别。

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const cfgPath = resolve(root, 'apps/cocos/build-config.wechat.json');
const projectConfigPath = resolve(root, 'apps/cocos/build/wechatgame/project.config.json');

const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
if (!cfg.appid || !String(cfg.appid).startsWith('wx')) {
  console.error('invalid wechat appid in', cfgPath);
  process.exit(1);
}

const project = JSON.parse(readFileSync(projectConfigPath, 'utf8'));
project.appid = cfg.appid;
writeFileSync(projectConfigPath, JSON.stringify(project, null, 2), 'utf8');
console.log(`wechat appid patched: ${cfg.appid}`);
