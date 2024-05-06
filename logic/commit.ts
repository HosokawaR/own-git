import peggy from "npm:peggy@4.0.2";
import { NULL_BYTE } from "./config.ts";

export type CommitContent = {
  entryTreeSha: string;
  parentCommitShas: string[];
  comment: string;
  keyValues: {
    key: string;
    value: string;
  }[];
};

export const serializeCommit = (content: CommitContent): string => {
  let text = `tree ${content.entryTreeSha}\n`;
  if (content.parentCommitShas.length > 0)
    text += `${content.parentCommitShas
      .map((sha) => `parent ${sha}`)
      .join("\n")}\n`;
  text += `${content.keyValues
    .map(({ key, value }) => `${key} ${value}`)
    .join("\n")}\n`;
  text += `\n${content.comment}\n`;

  return `commit ${text.length}${NULL_BYTE}${text}`;
};

export const formatCommit = (
  commitSha: string,
  content: CommitContent
): string => {
  let text = `commit sha ${commitSha}\n`;
  text += `tree ${content.entryTreeSha}\n`;
  if (content.parentCommitShas.length > 0)
    text += `${content.parentCommitShas
      .map((sha) => `parent ${sha}`)
      .join("\n")}\n`;
  text += `${content.keyValues
    .map(({ key, value }) => `${key} ${value}`)
    .join("\n")}\n`;
  text += `\n${content.comment}\n`;

  return `${text}`;
};

const parser = peggy.generate(`
  Tree 
    = "commit" _ [0-9]+ Null 
      entryTreeSha:("tree" _ @entryTrrSha:Sha Br)
      parentCommitShas:("parent" _ sha:Sha Br { return sha } )*
      keyValues:(key:Glyph+ _ value:Ascii+ Br { return { key: key.join(""), value: value.join("") } } )*
      comment:(Br c:.* { return c.join("") })?
    {
      return {
        entryTreeSha,
        parentCommitShas,
        keyValues,
        comment
      }
    }

  Sha 
    = sha:[0-9a-f]|40| { return sha.join("") }

  Ascii
    = [ -~]

  Glyph
    = [!-~]

  Null
    = "${NULL_BYTE}"
    
  Br
    = "\\n"

  _ 
    = " "
`);

export const parseCommit = (payload: string): CommitContent => {
  const result = parser.parse(payload);
  return {
    ...result,
    comment: result.comment || "",
  };
};

export const formatTimestampWithTimezone = (date: Date) => {
  const timestamp = Math.floor(date.getTime() / 1000);
  const timezoneOffset = -date.getTimezoneOffset();
  const sign = timezoneOffset >= 0 ? "+" : "-";
  const offsetHours = String(
    Math.floor(Math.abs(timezoneOffset) / 60)
  ).padStart(2, "0");
  const formattedTimezone = `${sign}${offsetHours}00`;
  return `${timestamp} ${formattedTimezone}`;
};
