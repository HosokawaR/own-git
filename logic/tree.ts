import { join } from "https://deno.land/std@0.217.0/path/join.ts";
import { NULL_BYTE } from "./config.ts";
import { getType } from "./object.ts";
import {
  evacuate,
  restoreDirectory,
  restoreFile,
} from "../repository/working.ts";
import { readObjectBySha } from "../repository/object.ts";

export type TreeLineItem = { mode: string; name: string; sha: string };
export type TreeContent = TreeLineItem[];

export const parseTree = (body: string): TreeContent => {
  const replaced = body.replaceAll(NULL_BYTE, "\0");

  const treeMatch = replaced.match(/tree \d+\0/g);
  if (!treeMatch) return [];

  const entryRegex = /(\d+) (.*?)\0([0-9a-f]{40})/g;

  const entries: TreeContent = [];

  const entriesPart = replaced.substring(treeMatch[0].length);
  let match;
  while ((match = entryRegex.exec(entriesPart)) !== null) {
    const [, , name, sha] = match;
    entries.push({ name, sha, mode: "" });
  }

  return entries;
};

export const restoreTree = (treeSha: string) => {
  evacuate();
  restoreTreeVisitor(".", treeSha);
};

const restoreTreeVisitor = (path: string, sha: string): void => {
  const tree = readObjectBySha(sha);
  const treeType = getType(tree);

  if (treeType === "commit") throw new Error("Unexpected type: commit");

  if (treeType === "blob") {
    restoreFile(path, sha);
    return;
  }

  if (path !== ".") restoreDirectory(path);

  const treeContent = parseTree(tree);

  treeContent.forEach((content) => {
    restoreTreeVisitor(join(path, content.name), content.sha);
  });
};

export const serializeTreeContent = (content: TreeContent): string => {
  const body = content
    .reduce<string[]>((acc, { name, sha, mode }) => {
      return [...acc, `${mode} ${name}${NULL_BYTE}${sha}`];
    }, [])
    .join("");

  return body;
};
