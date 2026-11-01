# Style

Docs in every Hyperjump repo follow the
[Google developer documentation style guide](https://developers.google.com/style).
[proselint](https://github.com/amperser/proselint) adds checks for
clichés, jargon, and other common writing mistakes.

Vale checks both, and checks spelling. Each repo with docs has a
`.vale.ini` that turns on Vale's own style, which includes spell check, and
the Google and proselint styles at every alert level, including
suggestions.
It also lists the Hyperjump package, which holds the project's vocabulary:

```ini
Packages = Google, proselint, https://hyperjump.io/vale/Hyperjump.zip
```

## Design docs

Design docs in `design/` are for contributors, and the Google guide
doesn't apply to them. Vale checks them for spelling, terms, and proselint
only:

```ini
[design/**/*.md]
BasedOnStyles = Vale, proselint
```

The Google guide is for docs that people read to use a product. Design
docs record decisions, so passive voice ("Rejected: X, because it was…"),
asides in parentheses, and words like "now" are usual and correct in them.

Put this section after the section for the docs. When a file matches more
than one section, the later one wins.

## Code font

The Google guide says to
[put code in code font](https://developers.google.com/style/code-in-text).
In these docs, that includes these names:

- JSON Schema keywords, like `allOf` or `$defs`. Headings too.
- Repo and package names, like `json-schema`, `browser`, and `unified`.

## Vocabulary

The Hyperjump vocabulary lists terms that Vale doesn't know. Most are names
of formats or protocols. Vale treats each term as an exception in rules
that check terms. For example, `Google.Headings` accepts `JRef` in a
sentence-case heading, and `Google.Acronyms` doesn't ask you to spell out
`AST`.

The package is in this repo, in `vale/Hyperjump/`. Its `.vale.ini` sets
`Vocab = Hyperjump`, and Vale merges that into each repo's config, so a
repo only lists the package. The build zips the package into
`dist/vale/Hyperjump.zip`, and the site serves it.

To add a term:

1. Add it to
   `vale/Hyperjump/styles/config/vocabularies/Hyperjump/accept.txt`, one
   term per line. Each line is a case-sensitive regular expression.
2. Push to `main`. The site deploys with the new package.
3. Run `vale sync` in each repo to get it.

Add a term only when Vale flags it in a doc, and the term is correct.

`Vale.Terms` also enforces each term's case. With `JSON` in the
vocabulary, it flags `json` in prose. Don't add a term that's also correct
in a different case. For example, `readOnly` would make `Vale.Terms` flag
the TypeScript word `readonly`. Format identifiers like keywords, repo
names, and package names as code instead. Vale doesn't check code.

Rejected: a vocabulary in each repo. The repos share most terms, and each
copy would drift.

## Setup

1. Install [Vale](https://vale.sh/docs/install). The `vale` command needs
   to be on your `PATH`.
2. Run `vale sync` in the repo. It downloads the styles to `.vale/`, which
   git ignores.
3. In Claude Code, run `/plugin install vale@agent-tools`. You only need
   to install it once. The repo's `.claude/settings.json` turns it on and
   sets `VALE_HOOK_LEVEL` to `suggestion`. After Claude edits a doc, the
   plugin runs Vale on it and gives Claude every alert to fix.

To check docs yourself, run `vale` on a file or a directory, such as
`vale website`.

## Exceptions

None yet. When a rule is wrong for these docs, turn it off in the
`.vale.ini` of every repo and record the reason here.
