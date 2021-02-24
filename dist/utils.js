"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.getTime = exports.formatText = exports.wrapLine = exports.formatName = void 0;
const NICK_LENGTH = 15;
const TOTAL_LENGTH = 120;
function formatName(nick, nickLen = NICK_LENGTH) {
    // TODO: Add filtering of unprinted chars
    if (nick.length > nickLen) {
        return nick.substring(0, nickLen - 1) + ">";
    }
    else if (nick.length < nickLen) {
        return " ".repeat(nickLen - nick.length) + nick;
    }
    return nick;
}
exports.formatName = formatName;
function wrapLine(s, w) {
    return s.replace(new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, "g"), "$1\n");
}
exports.wrapLine = wrapLine;
function formatText(text, textLen = TOTAL_LENGTH, nickLen = NICK_LENGTH) {
    const lines = text.match(/[^\r\n]+/g);
    // Offset = [(1) + time (8) + ](1) + _(1) = 11
    const offset = 11 + nickLen;
    const resLines = [];
    const width = textLen - offset;
    if (lines && lines.length) {
        lines.forEach((line) => {
            if (line.length > width) {
                wrapLine(line, width)
                    .match(/[^\r\n]+/g)
                    .forEach((line) => {
                    resLines.push(line);
                });
            }
            else {
                resLines.push(line);
            }
        });
    }
    return resLines
        .map((line, index) => index > 0 ? " ".repeat(offset) + " | " + line : line)
        .join("\n");
}
exports.formatText = formatText;
function getTime() {
    return new Date().toLocaleTimeString("en-US", { hour12: false });
}
exports.getTime = getTime;
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
exports.delay = delay;
//# sourceMappingURL=utils.js.map