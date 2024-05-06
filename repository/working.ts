import { readObjectBySha } from "./object.ts";
import { walkSync } from "https://deno.land/std@0.217.0/fs/walk.ts";
import { existsSync } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std@0.217.0/path/join.ts";
import { relative } from "https://deno.land/std@0.217.0/path/relative.ts";
import { GIT_DIR } from "../logic/config.ts";
import { extractBodyFromBlob } from "../logic/object.ts";

export const restoreFile = (path: string, blobSha: string): void => {
  const payload = readObjectBySha(blobSha);
  const blobBody = extractBodyFromBlob(payload);
  Deno.writeTextFileSync(path, blobBody);
};

export const restoreDirectory = (path: string): void => {
  Deno.mkdirSync(path);
};

export const evacuate = (): void => {
  setupTemp();

  for (const entry of walkSync(".", {
    includeDirs: true,
    includeFiles: true,
    includeSymlinks: false,
    skip: [/node_modules/, /\.git/, /_git/],
  })) {
    if (entry.path === ".") continue;
    if (entry.isFile)
      Deno.renameSync(entry.path, `./${GIT_DIR}/temp/${entry.path}`);
    else if (entry.isDirectory) {
      Deno.mkdirSync(`./${GIT_DIR}/temp/${entry.path}`);
    }
  }
};

const setupTemp = () => {
  if (existsSync(`./${GIT_DIR}/temp`)) {
    Deno.removeSync(`./${GIT_DIR}/temp`, { recursive: true });
  }

  Deno.mkdirSync(`./${GIT_DIR}/temp`);
};

export const returnToWorking = () => {
  for (const entry of walkSync(`${GIT_DIR}/temp`, {
    includeDirs: true,
    includeFiles: true,
    includeSymlinks: false,
    skip: [],
  })) {
    if (entry.path === `${GIT_DIR}/temp`) continue;
    const relativePath = relative(`${GIT_DIR}/temp`, entry.path);
    const newPath = join(".", relativePath);
    if (entry.isFile) Deno.copyFileSync(entry.path, newPath);
    else if (entry.isDirectory) {
      Deno.mkdirSync(newPath);
    }
  }
};
