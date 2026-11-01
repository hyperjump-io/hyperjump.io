# Tooling

## Starlight

The site is [Astro Starlight](https://starlight.astro.build/). It renders
plain markdown (not MDX, so a `{` in a sentence is fine), has search
(Pagefind, with no service), page tables of contents, dark mode, and mobile
navigation, takes a sidebar from code, and builds a static site. Astro can
use Svelte components, so the ones in
[`json-schema.hyperjump.io`](https://github.com/hyperjump-io/json-schema.hyperjump.io)
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

See [JSON Schema highlighting](highlighting.md). It's an Expressive Code
plugin, so it doesn't depend on the markdown processor.

## Versions

Astro is pinned to 7.4.0. 7.4.2 needs Node 22.23.4 or later.
