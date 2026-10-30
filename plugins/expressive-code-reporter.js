// An Expressive Code plugin that colors what unified's reporter
// (vfile-reporter) prints, like the CLI's output, the way it's colored in a
// terminal. A `text` block is a report if a line is a message, like
// `1:27-1:29 error ...`, or the summary, like `2 messages (✖ 1 error, ...)`.
// The docs stay plain text, so they read the same on GitHub.
//
// - A file's name is underlined, in the color of its worst message, or of
//   no issues
// - `error` and `warning` are in their colors, and a message's text is bold
// - The summary's ✖ and ⚠ are the site's error and warning icons. The
//   characters stay, hidden, so they're copied with the rest.
import { ExpressiveCodeAnnotation } from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";
import { ClassAnnotation } from "./class-annotation.js";
import { icons } from "./icons.js";

const message = /^(\s*(?:\d+:\d+(?:-\d+:\d+)?\s+)?)(error|warning)(\s+)(.*)$/;
const positionedMessage = /^\s*\d+:\d+(?:-\d+:\d+)?\s+(?:error|warning)\s/;
const summary = /^(?:\d+ messages? \()?[✖⚠] \d+ (?:error|warning)/;
const noIssues = ": no issues found";
// The rule ID and source after a message's text: the last two words, if the
// last is a source, like `json-schema-lint`
const ruleAndSource = /^(.*?)\s+\S+\s+[a-z][\w-]*$/;

export default function pluginReporter() {
  return {
    name: "reporter",
    hooks: {
      postprocessAnalyzedCode: ({ codeBlock }) => {
        const lines = codeBlock.getLines();
        if (codeBlock.language === "text" && lines.some(({ text }) => positionedMessage.test(text) || summary.test(text))) {
          colorReport(lines);
        }
      }
    }
  };
}

function colorReport(lines) {
  let file;
  const endFile = () => {
    if (file) {
      mark(file.line, 0, file.length, `reporter-file reporter-${file.severity}`);
    }
    file = undefined;
  };

  for (const line of lines) {
    const { text } = line;
    const parts = message.exec(text);
    if (parts) {
      const [, before, severity, space, rest] = parts;
      mark(line, before.length, before.length + severity.length, `reporter-${severity}`);
      const reason = ruleAndSource.exec(rest)?.[1] ?? rest.trimEnd();
      const reasonStart = before.length + severity.length + space.length;
      mark(line, reasonStart, reasonStart + reason.length, "reporter-reason");
      if (file && (severity === "error" || file.severity !== "error")) {
        file.severity = severity;
      }
    } else if (summary.test(text)) {
      endFile();
      for (const [index, character] of [...text].entries()) {
        if (character === "✖" || character === "⚠") {
          line.addAnnotation(new IconAnnotation(character === "✖" ? "error" : "warning", { columnStart: index, columnEnd: index + 1 }));
        }
      }
    } else if (text.trim() === "") {
      endFile();
    } else if (!/^\s|^\$ /.test(text)) {
      endFile();
      const length = text.endsWith(noIssues) ? text.length - noIssues.length : text.length;
      file = { line, length, severity: "ok" };
    }
  }
  endFile();
}

function mark(line, columnStart, columnEnd, className) {
  if (columnEnd > columnStart) {
    line.addAnnotation(new ClassAnnotation(className, "later", {}, { columnStart, columnEnd }));
  }
}

// Shows a severity's icon in place of its character, which stays, visually
// hidden, so copying the output copies it.
class IconAnnotation extends ExpressiveCodeAnnotation {
  constructor(severity, inlineRange) {
    super({ inlineRange });
    this.severity = severity;
  }

  render({ nodesToTransform }) {
    return nodesToTransform.map((node) => h("span", { class: `reporter-icon reporter-${this.severity}` }, [
      h("svg", { viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": "true" }, [h("path", { d: icons[this.severity] })]),
      h("span", { class: "reporter-icon-character" }, node)
    ]));
  }
}
