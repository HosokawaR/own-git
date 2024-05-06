import { GIT_DIR } from "../../logic/config.ts";

/**
 * @param refPath ex) refs/head/test
 */
export const updateRef = (refPath: string, sha: string): void => {
  Deno.writeTextFileSync(`${GIT_DIR}/${refPath}`, sha);
};
