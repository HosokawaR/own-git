import { GIT_DIR } from "../logic/config.ts";

export const gitDirExsist = (): boolean => {
  try {
    return Deno.statSync(GIT_DIR).isDirectory;
  } catch {
    return false;
  }
};

export const initGitDir = (): void => {
  Deno.mkdirSync(GIT_DIR);
  Deno.mkdirSync(GIT_DIR + "/objects");
  Deno.mkdirSync(GIT_DIR + "/refs/heads", { recursive: true });
  Deno.writeTextFileSync(GIT_DIR + "/refs/heads/main", "");
  Deno.writeTextFileSync(GIT_DIR + "/HEAD", "ref: refs/heads/main\n");
};
