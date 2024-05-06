import { Tree, Blob } from "./commit.ts";
import { SEPARATOR_PATTERN } from "https://deno.land/std@0.217.0/path/mod.ts";
import { relative } from "https://deno.land/std@0.217.0/path/relative.ts";
import { collectPathsVisitor } from "../../repository/utls.ts";
import { GIT_DIR } from "../../logic/config.ts";

/**
 * @param targetPaths ex) [".", "some.txt", "lib", "lib/some/file.js"]
 */
export const add = (targetPaths: string[]) => {
  const filePaths = [
    ...new Set(
      targetPaths.reduce<string[]>((paths, targetPath) => {
        return [...paths, ...collectPathsVisitor(targetPath)];
      }, [])
    ),
  ].map((path) => relative(Deno.cwd(), path));

  const stagingTree = filePaths.reduce<Tree>((tree, cur) => {
    growBranch(cur, tree);
    return tree;
  }, {});

  saveAsJson(stagingTree);

  console.log(`These files are indexed:\n${filePaths.join("\n")}`);
};

const growBranch = (path: string, tree: Tree): void => {
  path.split(SEPARATOR_PATTERN).reduce<Tree | Blob>((acc, cur, idx, paths) => {
    if (typeof acc === "string") return {};
    if (idx === paths.length - 1) acc[cur] = Deno.readTextFileSync(path);
    else acc[cur] = acc[cur] ?? {};
    return acc[cur];
  }, tree);
};

const saveAsJson = (stagingTree: Tree): void => {
  const json = JSON.stringify(stagingTree, null, 2);
  Deno.writeTextFileSync(`${GIT_DIR}/staging-dump`, json);
};
