import { NULL_BYTE } from "../../logic/config.ts";
import { formatWithSize } from "../../logic/object.ts";
import { TreeContent } from "../../logic/tree.ts";
import { TreeLineItem } from "../../logic/tree.ts";
import { serializeTreeContent } from "../../logic/tree.ts";
import { saveObject } from "../../repository/object.ts";

export const writeTree = (content: TreeContent) => {
  const serialized = serializeTreeContent(content); 
  const output = formatWithSize("tree", serialized);
  return saveObject(output);
};
