#!/usr/bin/env node
/**
 * Render a Remotion composition to an mp4.
 *
 *   node render.mjs <project-dir> <composition-id> [output.mp4]
 *
 * Wraps `npx remotion render` with sane defaults and a clear final line
 * reporting the absolute output path, so the Mitra agent can pick the
 * artifact up reliably.
 */
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const [, , projectDir, compositionId, outArg] = process.argv;

if (!projectDir || !compositionId) {
  console.error(
    "usage: node render.mjs <project-dir> <composition-id> [output.mp4]",
  );
  process.exit(1);
}

const dir = resolve(projectDir);
if (!existsSync(join(dir, "package.json"))) {
  console.error(`[remotion] not a project directory (no package.json): ${dir}`);
  process.exit(1);
}

const output = outArg
  ? resolve(outArg)
  : join(dir, "out", `${compositionId}.mp4`);

console.log(`[remotion] rendering "${compositionId}" -> ${output}`);

const result = spawnSync(
  "npx",
  ["remotion", "render", compositionId, output],
  { cwd: dir, stdio: "inherit", env: process.env },
);

if (result.error) {
  console.error(`[remotion] failed to launch renderer: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(`[remotion] render failed (exit ${result.status})`);
  process.exit(result.status ?? 1);
}

console.log(`[remotion] ARTIFACT ${output}`);
