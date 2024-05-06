import { sha1 } from "https://denopkg.com/chiefbiiko/sha1/mod.ts";
import { GIT_DIR } from "./config.ts";

export const sha1FromContent = (data: string): string => {
  const hash = sha1(data);
  if (typeof hash === "string") return hash;

  return hash.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
};

export const getHeadSha = (): string | undefined => {
  // TODO: refactor
  const txt = Deno.readTextFileSync(`${GIT_DIR}/HEAD`);

  if (txt.includes("refs")) {
    const branchName = txt.split("/").at(-1)!.trim();
    return getShaFromBranch(branchName) || undefined;
  }

  const match = txt.match(/ref: (.+)/);
  return match![1].trim();
};

const getShaFromBranch = (branchName: string): string => {
  return Deno.readTextFileSync(`${GIT_DIR}/refs/heads/${branchName}`);
};
