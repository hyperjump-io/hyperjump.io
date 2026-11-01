# `hyperjump.io`

The documentation site for Hyperjump's JSON Schema tools:
[`json-schema`](https://github.com/hyperjump-io/json-schema),
[`cli`](https://github.com/hyperjump-io/cli),
[`json-schema-coverage`](https://github.com/hyperjump-io/json-schema-coverage),
[`json-schema-errors`](https://github.com/hyperjump-io/json-schema-errors),
[`json-language-server`](https://github.com/hyperjump-io/json-language-server),
and components like [`browser`](https://github.com/hyperjump-io/browser),
[`uri`](https://github.com/hyperjump-io/uri), and
[`pact`](https://github.com/hyperjump-io/pact). The docs
themselves live in each repo's `website/` directory. This repo gets them,
and builds and deploys the site with [Starlight](https://starlight.astro.build/).

## Running it

```bash
npm install
npm run dev          # docs from GitHub, at the branches in sources.js
npm run dev:local    # docs from checkouts next to this one (../json-schema, ...)
npm run build        # or build:local; the site goes in dist/
npm run preview      # or preview:local; serves dist/
```

Use the local scripts to preview docs changes before they're pushed. The docs
are copied when the site starts, so restart it to see later changes.

## Contributing

How the site works and why, and how to write docs for it, is in
[design/](design/README.md).
