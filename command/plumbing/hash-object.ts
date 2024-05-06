import { ObjectType, formatWithSize } from "../../logic/object.ts";
import { saveObject } from "../../repository/object.ts";

export const hashObject = (type: ObjectType, content: string): string => {
  const output = formatWithSize(type, content);
  const hexHash = saveObject(output);
  return hexHash;
};
