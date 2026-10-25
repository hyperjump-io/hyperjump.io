# Tooling

## Starlight

The site is [Astro Starlight](https://starlight.astro.build/). It renders
plain markdown (not MDX, so a `{` in a sentence is fine), has search
(Pagefind, with no service), page tables of contents, dark mode, and mobile
navigation, takes a sidebar from code, and builds a static site. Astro can
use Svelte components, so the ones in
[json-schema.hyperjump.io](https://github.com/hyperjump-io/json-schema.hyperjump.io)
could become interactive examples.

Its cost is its look. Changing the theme is easy, but a design far from
Starlight's means working against it.

Rejected:

- **SvelteKit with mdsvex.** Search, the sidebar, page contents, mobile
  navigation, and dark mode would all be built by hand.
- **VitePress.** Its plugins are markdown-it and its components are Vue.
- **Docusaurus.** React, heavier, and `.md` is MDX unless configured
  otherwise.

## Markdown processor

Astro 7's default markdown processor is Sätteri, not unified. The plugins are
Sätteri mdast plugins, which have the same tree shapes as remark's, with a
visitor per node type.

Rejected: staying on unified, through `@astrojs/markdown-remark`. It was the
stack the libraries are built on, but in Astro it's optional now, and remark
plugins in Astro's config are deprecated. The one feature it seemed to help,
JSON Schema highlighting, doesn't depend on it.

## JSON Schema highlighting

Not done yet. Highlighting keywords differently from property names needs to
know the schema: `"type"` in `properties` is a property name, and which words
are keywords depends on the dialect. A TextMate grammar, which is what Shiki
uses, can't get that right. It'd be a function from a code block's text to
ranges, using `@hyperjump/browser/json` and json-schema's keywords, plugged
into Expressive Code, Starlight's code blocks. It doesn't depend on the
markdown processor. The language server does the same thing for editors in
`json-schema-language-tools/language-server/src/features/semantic-tokens.js`.

## Versions

Astro is pinned to 7.4.0. 7.4.2 needs Node 22.23.4 or later.
