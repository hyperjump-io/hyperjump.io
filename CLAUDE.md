# hyperjump.io

The documentation site for json-schema, hjlint, and browser. It gets each
repo's `website/` and builds it with Astro Starlight.

## Docs

- `design/` is for contributors. Start with `design/README.md`, the index.
  `components/` say how each part works and what was decided, with what was
  rejected and known limitations.
- `README.md` says how to run the site and how to write docs for it.
- `TODO.md` is the plan and what's next. It isn't committed.
- Prefer many small documents that each cover one thing. A change to how
  something works updates its document in the same commit.

## Development

- `npm run build:local` builds from the sibling checkouts `../json-schema`,
  `../hjlint`, `../browser`, `../json-pointer`, and `../pact`. `npm run build` clones
  from GitHub.
- Don't edit `src/content/docs/<repo>/`. It's copied from the repos on
  every build. Fix docs in their repo. `src/content/docs/blog/` and topic
  front pages, like `src/content/docs/components/`, are this repo's.

## Working agreements

- Ask before committing. Keep unrelated changes in separate commits.
