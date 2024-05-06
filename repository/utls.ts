import { resolve } from "https://deno.land/std@0.217.0/path/resolve.ts";

export const collectPathsVisitor = (path: string): string[] => {
  const stat = Deno.statSync(path);
  if (!stat.isDirectory) return [resolve(path)];

  // fix
  if (path.endsWith("git")) return [];

  return [...Deno.readDirSync(path)].flatMap((dir) =>
    collectPathsVisitor(resolve(path, dir.name))
  );
};
