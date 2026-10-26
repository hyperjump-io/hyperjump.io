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
npm run preview      # or preview:local; serves dist/
```

Use the local scripts to preview docs changes before they're pushed. The docs
are copied when the site starts, so restart it to see later changes. The local
scripts use the checkouts as they are, so their dependencies need to be
installed for the API pages.

## Writing docs

Docs are plain markdown that reads well on GitHub. The site build handles the
rest.

- Each page starts with an H1. It becomes the page's title.
- `website/README.md` lists the pages, as a nested list under a `Contents`
  heading. That list is the section's sidebar, in the same order. Without
  the heading, it's the first list on the page.
- Link to other pages with relative links (`../guides/validating.md`). Link to
  another repo's docs with a GitHub link into its `website/`
  (`https://github.com/hyperjump-io/hjlint/blob/main/website/README.md`). A
  broken link fails the build.
- When a page moves or is merged into another, add its old path to
  `redirects.js` here, so links to it keep working.
- Show a short return value in a comment on its line
  (`validator.validate(value); // true`). Show anything longer after the
  code block, in a block of its own: what's printed in a `text` block, and
  data in a `json` block or a table, with only the properties that matter
  to the example.
- Keep lines in code blocks to 76 characters, so they fit without
  scrolling. `text` blocks wrap, so printed output can be as long as it
  is. For a value that can't be broken, like a long URI in JSON, add `wrap`
  to the fence (```` ```json wrap ````).
- Mark a feature that isn't released with `*Coming soon*` on its own line
  under its heading. `npm version` replaces it with `*Added in vX.Y.Z*`.
  `*Changed in vX.Y.Z*` and `*Deprecated in vX.Y.Z*` work the same way.
- A `json` code block with `$schema` is highlighted as a schema: keywords
  stand out from property names that aren't keywords. For a schema without
  `$schema`, give the dialect it's loaded with in the fence:
  ```` ```json dialect=https://json-schema.org/draft/2020-12/schema ````.
  GitHub ignores it. In a `javascript` block, an object literal with
  `$schema` is highlighted the same way.
- On a lint rule's page, each schema example is linted with the rule, and
  what each message is about is underlined. The build fails if the messages
  aren't the ones the page lists after the example.
- API pages come from the declaration files and the repo's `typedoc.json`.
  Link to another package's API with `https://hyperjump.io/<section>/api/...`
  in `externalSymbolLinkMappings`.

## Rebuilding when docs change

The site deploys on a push here, on a manual run, and when a repo sends a
`docs-changed` event. Each docs repo's `.github/workflows/docs-changed.yml`
sends it when `website/` changes on the branch the site builds from. They
need a `SITE_DISPATCH_TOKEN` secret, a token that can dispatch to this repo
(a fine-grained token with Contents read and write on hyperjump.io).

## Contributing

How the site works and why is in [design/](design/README.md).
