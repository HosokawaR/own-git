import { formatTimestampWithTimezone } from "../../logic/commit.ts";
import { AUTHOR, GIT_DIR } from "../../logic/config.ts";
import { TreeLineItem } from "../../logic/tree.ts";
import { getHeadSha } from "../../logic/utls.ts";
import { commitTree } from "../plumbing/commit-tree.ts";
import { hashObject } from "../plumbing/hash-object.ts";
import { updateRef } from "../plumbing/update-ref.ts";
import { writeTree } from "../plumbing/write-tree.ts";

export type Blob = string;
export type Tree = { [key: string]: Blob | Tree };

export const commit = (message: string) => {
  const statingJson = Deno.readTextFileSync(`${GIT_DIR}/staging-dump`);
  const staging = JSON.parse(statingJson) as Tree;

  const headSha = getHeadSha();
  const sha = visitor(staging);

  const commitDate = new Date();

  const commitSha = commitTree(
    sha,
    headSha,
    {
      author: `${AUTHOR} ${formatTimestampWithTimezone(commitDate)}`,
      committer: `${commitDate} ${formatTimestampWithTimezone(commitDate)}`,
    },
    message
  );

  // TODO: get branch name
  updateRef("refs/heads/main", commitSha);

  Deno.removeSync(`${GIT_DIR}/staging-dump`);
};

const visitor = (staging: Tree | Blob): string => {
  if (typeof staging === "string") {
    return hashObject("blob", staging);
  }

  const treeItems: TreeLineItem[] = [];

  for (const [key, value] of Object.entries(staging)) {
    treeItems.push({
      name: key,
      sha: visitor(value),
      mode: "100644",
    });
  }

  return writeTree(treeItems);
};
