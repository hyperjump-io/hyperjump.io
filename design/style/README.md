# Style

Docs in every Hyperjump repo follow the
[Google developer documentation style guide](https://developers.google.com/style).
[proselint](https://github.com/amperser/proselint) adds checks for
clichés, jargon, and other common writing mistakes.

Vale checks both. Each repo with docs has a `.vale.ini` that turns on the
Google and proselint styles at every alert level, including suggestions.

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
