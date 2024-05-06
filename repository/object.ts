import * as compress from "https://deno.land/x/compress@v0.4.6/zlib/mod.ts";
import { sha1FromContent } from "../logic/utls.ts";
import { GIT_DIR, PLANE_MODE } from "../logic/config.ts";

export const saveObject = (content: string): string => {
  const sha = sha1FromContent(content);

  const dirName = sha.slice(0, 2);

  Deno.mkdirSync(`${GIT_DIR}/objects`, { recursive: true });
  Deno.mkdirSync(`${GIT_DIR}/objects/${dirName}`, { recursive: true });

  if (PLANE_MODE) {
    Deno.writeTextFileSync(getObjectPath(sha), content);
  } else {
    const deflated = compress.deflate(new TextEncoder().encode(content));
    Deno.writeFileSync(getObjectPath(sha), deflated);
  }

  return sha;
};

export const readObjectBySha = (sha: string): string => {
  if (PLANE_MODE) return Deno.readTextFileSync(getObjectPath(sha));

  const data = Deno.readFileSync(getObjectPath(sha));
  const inflated = compress.inflate(data);
  return new TextDecoder().decode(inflated);
};

export const getObjectPath = (sha: string) =>
  `${GIT_DIR}/objects/${sha.slice(0, 2)}/${sha.slice(2)}`;
