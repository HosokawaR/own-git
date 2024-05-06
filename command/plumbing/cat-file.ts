import { NULL_BYTE } from "../../logic/config.ts";
import { readObjectBySha } from "../../repository/object.ts";

export const catFile = (sha: string) => {
  const [_, content] = readObjectBySha(sha).split(NULL_BYTE);
  return content;
};
