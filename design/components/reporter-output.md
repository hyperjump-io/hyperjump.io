# Reporter output

What unified's reporter (vfile-reporter) prints, like hjlint's output, is
colored the way it is in a terminal. `plugins/expressive-code-reporter.js`
finds it in a `text` block, by a line that's a message
(`1:27-1:29 error ...`) or the summary (`2 messages (✖ 1 error, ...)`), and
gives its parts classes that `src/styles/custom.css` colors. The docs stay
plain text, so they read the same on GitHub, and they don't mark which
blocks are a report.

- A file's name is underlined, in the color of its worst message: red for
  an error, orange for a warning, and the accent for none ("no issues
  found").
- `error` and `warning` are in their colors, and a message's text is bold.
  Its position, rule ID, and source aren't colored.
- The summary's ✖ and ⚠ are Starlight's error and warning icons, the ones
  on lint rule pages (`plugins/icons.js`), since the code font doesn't have
  the characters, and each system drew them with a font of its own, squished.
  The character stays, transparent, under the icon, so copying the output
  copies what the reporter printed. Rejected: hiding the character in a box
  with no width, which left it out of a copy, or out of the line, which
  copied it with line breaks around it.
- The reporter colors code in a message's backticks cyan. No message in the
  docs has any, so that isn't done.
- A message's rule ID and source are its last two words, if the last is
  lowercase, like `json-schema-lint`. A message without them, whose last
  two words look like them, isn't all bold.

Rejected: ANSI escapes in the docs, with Shiki's `ansi` language. They're
unreadable on GitHub.

## Colors

An error and a warning have the same colors in reporter output and on lint
rule pages (`--severity-error` and `--severity-warning`). They're text in
reporter output, so they're 4.5:1 or more against a code block: Starlight's
red and orange in the dark theme (5.4:1 and 10.3:1), and darker ones in the
light theme (5.7:1 and 5.2:1), where Starlight's are 3.4:1 and 1.7:1. "No
issues" is the accent (7.2:1 and 6.0:1).
