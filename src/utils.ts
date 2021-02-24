const NICK_LENGTH = 15;
const TOTAL_LENGTH = 120;

export function formatName(nick: string, nickLen: number = NICK_LENGTH) {
  // TODO: Add filtering of unprinted chars
  if (nick.length > nickLen) {
    return nick.substring(0, nickLen - 1) + ">";
  } else if (nick.length < nickLen) {
    return " ".repeat(nickLen - nick.length) + nick;
  }
  return nick;
}

export function wrapLine(s: string, w: number) {
  return s.replace(
    new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"),
    "$1\n"
  );
}

export function formatText(
  text: string,
  textLen: number = TOTAL_LENGTH,
  nickLen: number = NICK_LENGTH
) {
  const lines = text.match(/[^\r\n]+/g);
  // Offset = [(1) + time (8) + ](1) + _(1) = 11
  const offset = 11 + nickLen;
  const resLines: string[] = [];
  const width = textLen - offset;
  if (lines && lines.length) {
    lines.forEach((line) => {
      if (line.length > width) {
        wrapLine(line, width)
          .match(/[^\r\n]+/g)!
          .forEach((line) => {
            resLines.push(line);
          });
      } else {
        resLines.push(line);
      }
    });
  }
  return resLines
    .map((line, index) =>
      index > 0 ? " ".repeat(offset) + " | " + line : line
    )
    .join("\n");
}

export function getTime() {
  return new Date().toLocaleTimeString("en-US", { hour12: false });
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
