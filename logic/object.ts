import { NULL_BYTE } from "./config.ts";

export type ObjectType = "commit" | "tree" | "blob";

export const getType = (payload: string): ObjectType => {
  const match = payload.match(/(commit|tree|blob)/);
  if (!match) throw new Error("Content type header not found.");

  return match[0] as ObjectType;
};

export const formatWithSize = (type: ObjectType, content: string): string => {
  return `${type} ${getSize(content)}${NULL_BYTE}${content}`;
};

const getSize = (content: string): number => {
  // TODO: more accurate size calculation
  return content.length;
};

export const extractBodyFromBlob = (payload: string): string => {
  if (getType(payload) !== "blob") throw new Error("Expect blob, but isn't");

  const regex = new RegExp(`blob \\d+${NULL_BYTE}(.*)`);
  const match = payload.match(regex);
  if (!match) throw new Error("not matched");

  return match[1];
};
