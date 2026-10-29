# JSON Schema highlighting

In a `json` code block that's a schema, keywords look different from
property names that aren't keywords, and some keywords have their own look.
`plugins/expressive-code-json-schema.js` is an Expressive Code plugin that
resolves the block with `@hyperjump/json-schema` and gives each property
classes, which `src/styles/custom.css` styles.

| What | Name | Value |
|---|---|---|
| A keyword | bold, a stronger shade of the theme's property color | the theme's |
| A core keyword (`$schema`, `$id`, `$ref`, `$defs`, ...) | like a keyword, and italic | the theme's |
| `$schema` | like a core keyword | bold |
| An identifier (`$id`, `id`, `$anchor`, `$dynamicAnchor`, `$recursiveAnchor`) | like a core keyword | dotted underline |
| `$ref`, `$dynamicRef`, `$recursiveRef` | like a core keyword | underlined like a link |
| A `$ref` that replaces its schema (draft-04 through draft-07) | like a core keyword | the theme's |
| The object a replacing `$ref` is in | underlined like a link, all of it, since the whole object is the reference | |
| An `x-` keyword in v1, an annotation | italic | the theme's |
| `$comment`, an unknown keyword, or a sibling of a `$ref` that replaces its schema | gray and italic, like a comment in code, for all of it | |
| Any other property, like a name in `properties` | the theme's | the theme's |

- What's styled like a comment is in the code theme's color for comments.
  The plugin gets it from each theme as an Expressive Code style setting,
  so CSS has it as `--ec-jsonSchema-comment` for whichever theme is
  showing. It isn't a color of the site's: comments were Starlight's gray
  at first.
- A reference's underline is one color (the theme's text color), 1px, and
  doesn't skip around letters. Expressive Code wraps each token
  separately, and an underline followed each one's color and weight, so it
  changed under the parts of a reference. Rejected: a border instead of an
  underline, which nothing inside can change, but which sits below the
  descenders, unlike a link's underline.
- A reference is marked only by its underline. Its keyword is like any
  core keyword, `$schema`'s included, whether it replaces its schema or
  not. A replacing `$ref`'s object is underlined from brace to brace, so a
  one-line object is one line under all of it. An object over several
  lines is underlined line by line, braces included, and a sibling the
  `$ref` makes ignored has the reference's underline above the lint
  rule's wavy one. Rejected: a faint tint of the theme's string color
  behind the reference, with rounded ends, and the replacing `$ref`'s
  braces and value bold. It was more styling than the underline for the
  same thing. The tint was the site's accent at first, which only matched
  JSON when its property names were that green.
- Everything but comments keeps the code theme's colors (see
  [Look](look.md)), and stands apart by weight, slant, and underline, so
  any code theme works without restyling. A keyword is a little brighter
  than the theme's color for property names (`filter: brightness(1.15)`), or
  a little darker in the light theme (`0.85`), so it matches the names that
  aren't keywords without blending in. A filter sets no color. Picked on a
  temporary page with the options side by side. Rejected: a stronger filter
  (`1.35`), which turned the blue of GitHub's theme, the code theme then,
  cyan, since its blue channel is
  already at the maximum and only red and green can rise; a relative color
  (`oklch(from var(--0) …)`) that keeps the hue exactly, since it sets a
  color; and bold alone, which wasn't enough.
- An unknown keyword, or a sibling of a `$ref` that replaces its schema,
  has no effect, so it looks like a comment. An `x-` keyword is an
  annotation in v1, so it doesn't. Outside v1, it's unknown.
- The core keywords are the core vocabulary of 2019-09 and 2020-12:
  `$schema`, `$vocabulary`, the identifiers, the references (`$ref`,
  `$dynamicRef`, `$recursiveRef`), `$defs`, and `$comment`. They identify,
  reference, and hold schemas, so they read apart from the keywords that
  describe instances. Other dialects have the same keywords, like draft-07's
  `definitions`, with the same URIs, so they're core there too.
- Keywords are found by their URI in the dialect, not their name, so
  draft-04's `id` is an identifier, and an `$id` next to a draft-07 `$ref` is
  ignored, like the `$ref`'s other siblings.
- An embedded schema is highlighted by its own dialect.

A block is a schema if it has `$schema`, so the markdown is ordinary `json`
and reads the same on GitHub. A schema without `$schema` gives the dialect
it's loaded with in its fence, after the language:
```` ```json dialect=https://json-schema.org/draft/2020-12/schema ````. GitHub
only reads the first word as the language, so it still renders. It's the
resolver's `dialectUri`, like the `schema` parameter of a `Content-Type`.
`implicit-dialect`'s example needs it, since that's what the rule reports.
Rejected: reading the dialect from the prose before the example (fragile),
and a default dialect for every block (plain JSON would be highlighted as a
schema).

A `javascript` or `js` block is highlighted too, in each outermost object
literal with a `$schema` property, like the schema in Getting started.
`plugins/javascript-schemas.js` parses the block with acorn, writes each
such literal as JSON text, and remembers where each value, property, and
property name in the JSON came from in the JavaScript. The JSON is resolved
like a `json` block, and what's marked in it is marked where it came from.
A value that isn't a literal, like a variable, is `null` in the JSON, so it
isn't marked. A schema nested in one that's found is an embedded resource,
which the resolver finds. JavaScript keeps its theme's colors, so a key is
the text color, not the JSON property names' green, and a keyword stands
out from it by weight and brightness. Recoloring every object key to match
JSON was tried, and clashed with the rest of the JavaScript.

Resolving it, not matching patterns, is what makes it right: whether a name
is a keyword depends on where it is (`"type"` in `properties` is a property
name) and on the dialect. A TextMate grammar, which is what Shiki uses,
can't do that. The language server does the same thing for editors, in
`json-schema-language-tools`' `semantic-tokens.js`, so what decides a
name's class could move into the library for both.

- It runs after Shiki's highlighting (`postprocessAnalyzedCode`), and its
  annotations render in the `earlier` phase, so they wrap the highlighted
  tokens.
- `@hyperjump/json-schema` v2 isn't published, so it's loaded from the repo
  the site is built from (see [Content](content.md)), with every dialect.
  Its `install` in `sources.js` checks out the whole repo, not just
  `website/`, and runs `npm ci --omit=dev`, once its branch has docs.
  unified and browser's JSON parser come from that repo's `node_modules`, so
  they're the copies it uses. While json-schema's docs are
  [coming soon](content.md#where-pages-come-from), nothing is loaded,
  and examples aren't highlighted. They're only on json-schema's pages
  then, and on "Reading schemas", which nothing links to yet.
- It's loaded with Node's own `import()`. Astro loads the config with Vite,
  which rewrites `import()` to its module runner, and that's closed by the
  time code blocks render.
- Its session can't retrieve anything, so a `$schema` that isn't a built-in
  dialect has no keywords, and a build never goes to the network for an
  example.

The look was picked on a temporary page with every case, flipping through
options. Rejected: a color of its own for keywords (the accent, blue, gold),
since anything but the theme's color for property names clashed or blended
in; bold alone, which wasn't enough; a tinted background or an underline for keywords; a color for
identifiers; a box or a tinted background for `$schema`; and, for a `$ref`
object, a gray tint (too heavy) or a bar beside its lines (it marks whole
lines, not the object).

## Lint messages on rule pages

On a lint rule's page, each example is linted with that rule while it's
resolved, and what each message is about gets a wavy underline, orange for a
warning and red for an error (the site's severity colors, see
[Reporter output](reporter-output.md#colors)), with the message as its
title, like a problem in an editor. The severity is the rule's in `recommended`, which the page
says ("In `recommended`, as a warning"). The page's markdown doesn't change:
the rule decides where the underlines go.

The messages a page lists after an example, as a blockquote with one per
line, are shown as the linter's output by `plugins/lint-messages.js`: each
verbatim, in monospace, marked with its severity's icon (Starlight's
warning and error icons, the ones its caution and danger asides use) in
the color of the underlines. They're taken from the page's source, since a
blockquote's text gets typographic quotes, and the linter prints straight
ones. Rejected: leaving them as blockquotes, which read as quotations, not
output, and showed text the linter never prints; and marking them with ⚠
and ✖, like hjlint does, since the code font doesn't have them, so each
system drew them with a font of its own, and they came out squished.

If the rule's messages for an example aren't the ones the page lists after
it, the build fails. The rule pages were generated once from the rules'
tests, and this keeps them from drifting apart. It was a warning until
every page matched its rule.

- Every example on a rule page works with the rule's default options; no
  example needed options to report what the page says.
- Examples are resolved as `https://example.com/schema.json`, which shows in
  messages that name the document, like `reference-without-target`'s. Each
  block has a session of its own, so they can share it.

## Legend

`src/content/docs/reading-schemas.mdx`, at `/reading-schemas/`, says what
the styling means: three short schemas that show every style between them,
and a table of what each looks like, what it means, and where it is in the
examples. Every schema block's title, like "JSON Schema · 2020-12", links
to it ([Code block labels](code-labels.md)), so it's where a reader wonders
why something is italic or gray.

It's this repo's page, not a section's. The styling is the site's, and the
docs repos' markdown is read on GitHub too, where there's none. It's a
splash page without a hero, like the landing page without its logo, since
it isn't a package's and has no sidebar. When a style changes, the page
changes with it.

Rejected: a title on each styled property, shown on hover, which nothing
tells a reader to look for, a phone can't show, and lint underlines already
use for their messages; and a legend on the rules index, which only helps
a reader who starts there.

## Known limitations

- A schema without `$schema` isn't highlighted unless its fence gives its
  dialect.
- A schema in a JavaScript block is only found as an object literal with
  `$schema`. One built up in code, or without `$schema`, isn't highlighted.
- A message about the whole document, like `implicit-dialect`'s, underlines
  every line of the example.
