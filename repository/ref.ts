import { GIT_DIR } from "../logic/config.ts";

export const updateHeadRef = (path: string) => {
  Deno.writeTextFileSync(`${GIT_DIR}/HEAD`, `ref: ${path}`);
};

export const updateBranchRef = (branch: string, commitSha: string) => {
  Deno.writeTextFileSync(`${GIT_DIR}/refs/heads/${branch}`, commitSha);
};

export const createBranchRef = (branch: string, commitSha: string) => {
  Deno.writeTextFileSync(`${GIT_DIR}/refs/heads/${branch}`, commitSha);
};
