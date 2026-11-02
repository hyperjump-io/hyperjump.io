# Style

Docs in every Hyperjump repo follow the
[Google developer documentation style guide](https://developers.google.com/style).
Vale checks docs against the guide, and other styles add more checks:

- [proselint](https://github.com/amperser/proselint) checks for clichés,
  jargon, and other common writing mistakes.
- [Harper](https://writewithharper.com) checks grammar.
- A11y checks for writing that some readers can't use, like an image
  without alt text, a link that says "here", or text that points to
  something by its color.
- ai-tells checks for habits of AI-written prose, like "X, not Y"
  contrasts and figurative verbs like "lands" and "sits".

Each repo with docs has a `.vale.ini` that turns on Vale's own style,
which includes spell check, and these styles at every alert level,
including suggestions. It also lists the Hyperjump package, which holds
the project's vocabulary:

```ini
Packages = Google, proselint, Harper, A11y, ai-tells, https://hyperjump.io/vale/Hyperjump.zip
```

Harper's package has its own configuration, which turns Harper on for every
file, including code and docs that Vale shouldn't check. A `[**]` section
at the start of `.vale.ini` turns every style off, and the sections after
it turn styles on where they apply. It has to be `[**]`: Vale adds a
`[*]` section to Harper's `[*]` section instead of replacing it.

Rejected:

- write-good. Most of its alerts are from `E-Prime`, which flags every
  "is" and "are", and its `Passive` repeats `Google.Passive`.
- Readability. `Polysyllables` flags every word of three or more
  syllables, and its scores are one alert for a whole file, which doesn't
  say what to fix.
- `alex`. It flags "color" and "slant" as profane.

## Design docs

Design docs in `design/` are for contributors, and the Google guide
doesn't apply to them. Vale checks them for spelling and terms
and the other styles only:

```ini
[design/**/*.md]
BasedOnStyles = Vale, proselint, Harper, A11y, ai-tells
```

The Google guide is for docs that people read to use a product. Design
docs record decisions, so passive voice ("Rejected: X, because it was…"),
asides in parentheses, and words like "now" are usual and correct in them.

Put this section after the section for the docs. When a file matches more
than one section, Vale uses each setting from the last section that has
it.

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
`Vocab = Hyperjump`, and Vale merges that into each repo's configuration, so a
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

When a rule is wrong for these docs, turn it off in the `[**]` section of
the `.vale.ini` of every repo and record the reason here.

- `Harper.NumericRangeEnDash` asks for an en dash in a range of numbers.
  The Google guide says not to use en dashes, and to use a hyphen or "to".
- `ai-tells.VerbTricolon` flags most lists of three, not only three verbs.
- `ai-tells.ConsequenceClause` flags every ", so".
- `ai-tells.ColonUsage` flags a capital letter after a colon, even in a
  name like Starlight.
- `ai-tells.FormalTransitions` flags "For example", which the Google guide
  uses.
