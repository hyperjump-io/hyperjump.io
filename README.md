# hyperjump.io

The documentation site for Hyperjump's JSON Schema tools:
[json-schema](https://github.com/hyperjump-io/json-schema),
[hjlint](https://github.com/hyperjump-io/hjlint), and
[browser](https://github.com/hyperjump-io/browser). The docs themselves live
in each repo's `website/` directory. This repo gets them, and builds and
deploys the site with [Starlight](https://starlight.astro.build/).

## Running it

```bash
npm install
npm run dev          # docs from GitHub, at the branches in sources.js
npm run dev:local    # docs from checkouts next to this one (../json-schema, ...)
npm run build        # or build:local; the site goes in dist/
```

Use the local scripts to preview docs changes before they're pushed. The docs
are copied when the site starts, so restart it to see later changes.

## Writing docs

Docs are plain markdown that reads well on GitHub. The site build handles the
rest.

- Each page starts with an H1. It becomes the page's title.
- `website/README.md` lists the pages, as a nested list. That list is the
  section's sidebar, in the same order.
- Link to other pages with relative links (`../usage/modes.md`). Link to
  another repo's docs with a GitHub link into its `website/`
  (`https://github.com/hyperjump-io/hjlint/blob/main/website/README.md`). A
  broken link fails the build.
- Mark a feature that isn't released with `*Coming soon*` on its own line
  under its heading. `npm version` replaces it with `*Added in vX.Y.Z*`.
  `*Changed in vX.Y.Z*` and `*Deprecated in vX.Y.Z*` work the same way.

## Rebuilding when docs change

The site deploys on a push here, on a manual run, and when a repo sends a
`docs-changed` event. Each docs repo's `.github/workflows/docs-changed.yml`
sends it when `website/` changes on the branch the site builds from. They
need a `SITE_DISPATCH_TOKEN` secret, a token that can dispatch to this repo
(a fine-grained token with Contents read and write on hyperjump.io).

## Contributing

How the site works and why is in [design/](design/README.md).
