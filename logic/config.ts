export const PLANE_MODE = Deno.env.get("PLANE_MODE") === "true";
export const GIT_DIR = Deno.env.get("GIT_DIR") ?? "./_git";
export const NULL_BYTE = PLANE_MODE ? '<<<NULL>>>' : '\0'

export const AUTHOR = Deno.env.get("AUTHOR") ?? "Your name <your@example.com>"
export const COMMITTER = Deno.env.get("COMMITTER") ?? "Your name <your@example.com>"
