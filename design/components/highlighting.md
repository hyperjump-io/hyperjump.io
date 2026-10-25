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
| `$ref`, `$dynamicRef`, `$recursiveRef` | like a core keyword | underlined like a link, on a faint tint of the accent |
| A `$ref` that replaces its schema (draft-04 through draft-07) | like a core keyword | bold, and underlined like a link |
| The object a replacing `$ref` is in | a faint tint of the accent behind all of it, and its braces bold in the accent, made stronger like a keyword, since it's neither a schema nor plain JSON | |
| An `x-` keyword in v1, an annotation | italic | the theme's |
| `$comment`, an unknown keyword, or a sibling of a `$ref` that replaces its schema | gray and italic, like a comment in code, for all of it | |
| Any other property, like a name in `properties` | the theme's | the theme's |

- Everything but comments keeps the code theme's colors (see
  [Look](look.md)), and stands apart by weight, slant, and underline. A
  keyword's color is a stronger shade of the theme's color for property
  names, so it matches the names that aren't keywords without blending in.
  It's a CSS filter, brighter in the dark theme and more saturated in the
  light one, so it follows the theme. Darkening alone, in the light theme,
  grayed it.
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
and reads the same on GitHub. Every example in the rule pages has one.

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
  unified and browser's JSON parser come from that repo's `node_modules`, so
  they're the copies it uses.
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

## Known limitations

- A schema without `$schema` isn't highlighted.
- A schema in a JavaScript block, like the one in Getting started, isn't
  highlighted.
