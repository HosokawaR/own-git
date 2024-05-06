import { initGitDir } from "./repository/git.ts";
import { gitDirExsist } from "./repository/git.ts";
import { add } from "./command/porcelain/add.ts";
import { commit } from "./command/porcelain/commit.ts";
import { checkout } from "./command/porcelain/checkout.ts";
import { log } from "./command/porcelain/log.ts";

const command = Deno.args.at(0);

if (!command) {
  console.error("No command given");
  Deno.exit(1);
}

if (!gitDirExsist() && command !== "init") {
  console.error("Not a git repository");
  Deno.exit(1);
}

if (command === "init") {
  initGitDir();
} else if (command === "add") {
  const targets = Deno.args.slice(1);
  if (targets.length === 0) {
    console.error("Please specify a file to add");
    Deno.exit(1);
  }
  add(targets);
} else if (command === "commit") {
  const message = Deno.args.slice(1).join("\n");
  if (!message) {
    console.error("Please specify a commit message");
    Deno.exit(1);
  }
  commit(message);
} else if (command === "checkout") {
  const ref = Deno.args.at(1);
  if (!ref) {
    console.error("Please specify a ref");
    Deno.exit(1);
  }
  checkout(ref);
} else if (command === "log") {
  log()
}else {
  console.error("Unknown command");
  Deno.exit(1);
}

Deno.exit(0);
