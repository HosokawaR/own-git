import { formatCommit } from "../../logic/commit.ts";
import { parseCommit } from "../../logic/commit.ts";
import { getHeadSha } from "../../logic/utls.ts";
import { readObjectBySha } from "../../repository/object.ts";

export const log = () => {
  const headSha = getHeadSha();
  if (!headSha) {
    console.log("No commits yet");
    return;
  }
  let sha = headSha;

  while (sha) {
    const commit = parseCommit(readObjectBySha(sha));
    console.log(formatCommit(sha, commit));
    sha = commit.parentCommitShas?.[0];
  }
};
