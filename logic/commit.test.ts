import { parseCommit, serializeCommit } from "./commit.ts";
import { assertEquals } from "https://deno.land/std@0.217.0/assert/mod.ts";

Deno.test("parseCommit", async (t) => {
  await t.step("normal", () => {
    assertEquals(
      parseCommit(
        `commit 151\0tree 0123456789aaaaaaaaaabbbbbbbbbbcccccccccc
parent aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
author me <me@example.com>
committer me <me@example.com>
`
      ),
      {
        entryTreeSha: "0123456789aaaaaaaaaabbbbbbbbbbcccccccccc",
        parentCommitShas: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
        comment: "",
        keyValues: [
          {
            key: "author",
            value: "me <me@example.com>",
          },
          {
            key: "committer",
            value: "me <me@example.com>",
          },
        ],
      }
    );
  });

  await t.step("without parent commit", () => {
    assertEquals(
      parseCommit(
        `commit 151\0tree 0123456789aaaaaaaaaabbbbbbbbbbcccccccccc
author me <me@example.com>
committer me <me@example.com>
`
      ),
      {
        entryTreeSha: "0123456789aaaaaaaaaabbbbbbbbbbcccccccccc",
        parentCommitShas: [],
        comment: "",
        keyValues: [
          {
            key: "author",
            value: "me <me@example.com>",
          },
          {
            key: "committer",
            value: "me <me@example.com>",
          },
        ],
      }
    );
  });

  await t.step("merge commit", () => {
    assertEquals(
      parseCommit(
        `commit 151\0tree 0123456789aaaaaaaaaabbbbbbbbbbcccccccccc
parent aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
parent bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb
author me <me@example.com>
committer me <me@example.com>
`
      ),
      {
        entryTreeSha: "0123456789aaaaaaaaaabbbbbbbbbbcccccccccc",
        parentCommitShas: [
          "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
        ],
        comment: "",
        keyValues: [
          {
            key: "author",
            value: "me <me@example.com>",
          },
          {
            key: "committer",
            value: "me <me@example.com>",
          },
        ],
      }
    );
  });

  await t.step("with comments", () => {
    assertEquals(
      parseCommit(
        `commit 151\0tree 0123456789aaaaaaaaaabbbbbbbbbbcccccccccc
parent aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
author me <me@example.com>
committer me <me@example.com>

message message
message message
`
      ),
      {
        entryTreeSha: "0123456789aaaaaaaaaabbbbbbbbbbcccccccccc",
        parentCommitShas: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
        comment: "message message\nmessage message\n",
        keyValues: [
          {
            key: "author",
            value: "me <me@example.com>",
          },
          {
            key: "committer",
            value: "me <me@example.com>",
          },
        ],
      }
    );
  });
});

Deno.test("serializeCommit", async (t) => {
  await t.step("normal", () => {
    assertEquals(
      serializeCommit({
        entryTreeSha: "0123456789aaaaaaaaaabbbbbbbbbbcccccccccc",
        parentCommitShas: ["aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"],
        keyValues: [
          {
            key: "author",
            value: "me <me@example.com>",
          },
        ],
        comment: "message",
      }),
      `commit 130\0tree 0123456789aaaaaaaaaabbbbbbbbbbcccccccccc
parent aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
author me <me@example.com>

message
`
    );
  });

  await t.step("first commit", () => {
    assertEquals(
      serializeCommit({
        entryTreeSha: "0123456789aaaaaaaaaabbbbbbbbbbcccccccccc",
        parentCommitShas: [],
        keyValues: [
          {
            key: "author",
            value: "me <me@example.com>",
          },
        ],
        comment: "message",
      }),
      `commit 82\0tree 0123456789aaaaaaaaaabbbbbbbbbbcccccccccc
author me <me@example.com>

message
`
    );
  });
});
