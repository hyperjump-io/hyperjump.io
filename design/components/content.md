# Content

## One site

json-schema, hjlint, and browser have one site, with a section each, and not
a site each. Their users move between them: lint rules are json-schema's, but
they're run from code with `lint` and from the command line with hjlint, and
both packages rest on browser's retrieval. One site has one search, one
navigation, and links between packages that are checked.

The site presents a set of tools, not a JSON Schema site, because browser is
useful without JSON Schema.

## Which repo documents what

Each topic has one home, and the others link to it.

| Topic | Home |
|---|---|
| Validation, dialects, keywords, custom keywords, output | json-schema |
| Lint rules (a page each), the `lint` method | json-schema |
| The CLI, lint configuration, rule plugins | hjlint |
| Retrieval, URLs, media types, caching, `allowRetrieval` | browser |
| How json-schema uses retrieval | json-schema, linking to browser |

json-schema v1 isn't on the site. The landing page links to the README on
its branch.

## Where pages come from

The docs stay in each repo's `website/`, as plain markdown that reads well on
GitHub. `scripts/fetch-content.js` gets them for each repo in `sources.js`:

- From GitHub, a shallow clone at the head of the repo's branch, in
  `.cache/repos/`, updated in place on later builds. It's sparse, with only
  `website/`, unless the repo has [API pages](api.md), which need the whole
  repo and `npm install`.
- With `LOCAL_REPOS` set, from checkouts in that directory, to preview docs
  before they're pushed.

It copies them to `src/content/docs/<section>/`. `README.md` becomes
`index.md`, and the page's H1 moves into frontmatter as its title, since
Starlight requires one. A title is plain text, so backticks in the H1 are
dropped. A page that doesn't start with an H1 is an error.

The fetch step deletes Astro's content caches (`.astro/data-store.json`
and `node_modules/.astro/data-store.json`) before every start and build.
Astro keeps each page's rendered HTML and reuses it while the page's
markdown is the same, even when what renders it, like a plugin or the code
themes, has changed. `astro dev --force` was tried first, and doesn't clear
the cache the dev server uses.

## One version, from branch heads

The site is built from the head of each repo's branch, not from release tags.
Improvements to the docs should show up right away, for everyone, and not
wait for a release. There's one version of the docs, and
[version markers](version-markers.md) say when a feature was added, or that
it's coming soon.

Rejected:

- **Release tags.** The docs match what's installed, but every improvement
  waits for a release.
- **Git submodules.** They pin like tags, and every update is a commit here.
- **Docs in the npm packages.** Every package gets bigger, and every docs
  change needs a publish.
- **Each repo deploying its own section.** Navigation and search split, which
  one site was meant to avoid.

## Known limitations

- Pages are copied when the site starts, so `npm run dev:local` doesn't see
  later changes until it's restarted.
