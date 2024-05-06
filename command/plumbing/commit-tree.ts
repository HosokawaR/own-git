import { serializeCommit } from "../../logic/commit.ts";
import { saveObject } from "../../repository/object.ts";

export const commitTree = (
  entryTreeSha: string,
  parentCommitSha: string | undefined,
  fields: { [key: string]: string },
  comment: string
): string => {
  const output = serializeCommit({
    entryTreeSha,
    parentCommitShas: parentCommitSha ? [parentCommitSha] : [],
    keyValues: Object.entries(fields).map(([key, value]) => ({ key, value })),
    comment,
  });
  return saveObject(output);
};
