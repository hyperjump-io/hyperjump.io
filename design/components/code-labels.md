# Code block labels

Every code block is titled with what it is, so a schema and the JSON it
describes, which look alike, read apart. `plugins/expressive-code-labels.js`
sets the title from the block's language, and for JSON, from whether it's a
schema, by the same rule as [JSON Schema highlighting](highlighting.md): it
has `$schema`, or its fence gives the dialect it's loaded with.

| Block | Title |
|---|---|
| A schema | JSON Schema · 2020-12, from its dialect: v1, 2020-12, 2019-09, draft-07, draft-06, or draft-04 |
| A schema in another dialect, like a custom one | JSON Schema |
| Other JSON | JSON |
| JavaScript, TypeScript | JavaScript, TypeScript |
| bash, sh, shell | Terminal |
| text | Output, since the docs show what's printed in a `text` block |

A block with a title of its own, from `title` in its fence, keeps it. The
docs don't change, so they read the same on GitHub.

- The title is a caption, not an editor's tab, which reads as a file name:
  the header is the code's background, over a hairline, and the title is
  small and gray. It's set with Expressive Code's frame style settings in
  `astro.config.mjs`, and the title's size and color in
  `src/styles/custom.css`.
- A shell block has the same frame as other code, titled "Terminal". It had
  Expressive Code's terminal frame, a window's title bar with three dots,
  which only shell blocks had, even without a title, so a command and its
  output were framed differently.

Rejected: a label in a corner of the block, which takes no height, but
crowds the copy button, and is easy to miss.

## Known limitations

- Each block is about 30px taller. Rule pages, with several short examples,
  show it most.
