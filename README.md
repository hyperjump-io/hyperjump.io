# hyperjump.io

The documentation site for Hyperjump's JSON Schema tools:
[json-schema](https://github.com/hyperjump-io/json-schema),
[cli](https://github.com/hyperjump-io/cli),
[json-schema-coverage](https://github.com/hyperjump-io/json-schema-coverage),
[json-schema-errors](https://github.com/hyperjump-io/json-schema-errors),
[json-language-server](https://github.com/hyperjump-io/json-language-server),
and components like [browser](https://github.com/hyperjump-io/browser),
[uri](https://github.com/hyperjump-io/uri), and
[pact](https://github.com/hyperjump-io/pact). The docs
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

## Writing docs

Docs are plain markdown that reads well on GitHub. The site build handles the
rest.

Write prose that reads as one explanation, not a list of separate facts:

- Make each sentence pick up from the one before it. Join a cause to what it
  causes instead of stating them as two sentences. "A document can refer to
  anything anywhere, so `Hyperjump` won't retrieve anything from the network
  until you tell it where it may go."
- Give the reason before the instruction. "The cache belongs to the HTTP
  plugin, so to change it you replace the HTTP plugin" tells the reader why
  the step works.
- Be precise. Use the API's own terms, such as "a `Hyperjump` instance" or
  "the default for `allowRetrieval`", instead of a friendly paraphrase. Don't
  simplify until it's wrong. "The session won't retrieve it again" sounds
  like a document can only be read once. Say what actually happens.
- Say what the reader needs and leave out internals that don't change what
  they do. "The string you pass to `get` is the same on every operating
  system" is more useful than the name of the error a backslash causes.
- Introduce every code block and table with a sentence that says what it
  shows. When an example demonstrates something, say what.
- Don't announce. Lines like "Now for the good part" or "Look at what's
  missing" add nothing. Say what's interesting instead.

Keep each sentence easy to read once:

- When a sentence needs a second "so", "and", or "which" to finish, split it.
- Don't add clauses with commas. "It's an ES module with TypeScript types"
  reads better than "It's an ES module, with TypeScript types". Don't put a
  comma before "and" when it joins only two things, but do when it ends a
  list of three or more: "apples and bananas", "apples, bananas, and
  oranges". A comma after an introductory clause is fine: "When you step into
  one, you get the value it refers to."
- Lead with the action and say who does what: "Use `--frail` to fail on
  warnings."
- Use a list or a table for three or more parallel items with details,
  instead of a long sentence that strings them together.
- Prefer "for example" and "such as" over a parenthetical, and "see X" as
  its own sentence over "(see X)".
- Use small words like "that", "the", and "it's" when they make a sentence
  easier to read. Short isn't the goal. Clear is.

The rest is about how pages are put together:

- Each page starts with an H1. It becomes the page's title.
- `website/README.md` lists the pages, as a nested list under a `Contents`
  heading. That list is the package's sidebar, in the same order. Without
  the heading, the package has one page.
- A new package goes in `sources.js`, with the topic it's listed in.
  Until its branch has `website/`, its page links to its README on GitHub.
  Mark a package that isn't released yet `unreleased`. A
  topic with more than one package has a front page here, at
  `src/content/docs/<topic>/index.mdx`.
- Link to other pages with relative links (`../guides/validating.md`). Link to
  another repo's docs with a GitHub link into its `website/`
  (`https://github.com/hyperjump-io/cli/blob/main/website/README.md`). A
  broken link fails the build.
- When a page moves or is merged into another, add its old path to
  `redirects.js` here, so links to it keep working.
- Write examples in TypeScript, in `typescript` blocks, as a TypeScript
  user would: `satisfies` for an object that has to fit a type, like a
  keyword, and types on parameters that aren't inferred. Explain a type
  where its thing is explained, not in an "In TypeScript" section. Check
  that a typed example compiles.
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
- Put a JRef document in a `jref` block. It's highlighted as JSON, and
  each reference looks like a `$ref` that replaces its schema, underlined
  as a link. GitHub shows it without colors.
- On a lint rule's page, each schema example is linted with the rule, and
  what each message is about is underlined. The build fails if the messages
  aren't the ones the page lists after the example.

## Writing a post

Posts are in `src/content/docs/blog/`, one markdown file each, written here.
The file name is the post's URL (`blog/<file name>/`). Its frontmatter has
a `title`, a `date`, `authors`, and optionally `tags` and an `excerpt` for
the post list. Everything under "Writing docs" works in posts too. A post
links to the docs for how things work, and isn't updated after it's
published.

## Rebuilding when docs change

The site deploys on a push here, on a manual run, and when a repo sends a
`docs-changed` event. Each docs repo's `.github/workflows/docs-changed.yml`
sends it when `website/` changes on the branch the site builds from, with
a token from the org's docs dispatch app: a GitHub App with Contents read
and write, installed only on hyperjump.io. Each docs repo needs the app's
client ID as a `SITE_DISPATCH_CLIENT_ID` variable and its private key as a
`SITE_DISPATCH_APP_KEY` secret, both set for the org and shared with the
docs repos.

## Contributing

How the site works and why is in [design/](design/README.md).
