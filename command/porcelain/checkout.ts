import { parseCommit } from "../../logic/commit.ts";
import { restoreTree } from "../../logic/tree.ts";
import { readObjectBySha } from "../../repository/object.ts";
import { updateHeadRef } from "../../repository/ref.ts";

export const checkout = (commitSha: string) => {
    const commit = parseCommit(readObjectBySha(commitSha))
    restoreTree(commit.entryTreeSha)
    updateHeadRef(commitSha)
}
