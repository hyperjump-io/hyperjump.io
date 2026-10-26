# Version markers

There's one version of the docs, so a page says when a feature was added. A
marker is a line of its own under the heading it applies to:

```md
### Custom output formats

*Added in v2.3.0*
```

- `*Added in vX.Y.Z*`, `*Changed in vX.Y.Z*`, and `*Deprecated in vX.Y.Z*`.
- `*Coming soon*` is for a feature that's merged but not released. The
  release replaces it with `*Added in vX.Y.Z*`, so a version is never typed
  by hand.
- What's in v2.0.0 has no marker. Markers start with the release after it.

On GitHub, a marker is italics. `plugins/version-markers.js` makes it a
badge. A paragraph of italics that starts like a marker but doesn't match,
like `*Added in 2.3.0*`, fails the build, so a typo doesn't become plain
italics.

Rejected: "unreleased" in place of "Coming soon".

## The current version

Each package's version is beside its name in the sidebar, from its repo's
`package.json` (`sidebar.js`). It's what
a reader compares markers against: a feature "Added in v2.1.0" is in it if
it's v2.1.0 or later. `npm version` bumps it at each release, so between
releases it's the last release, and what's newer is marked "Coming soon".
A prerelease, like `2.1.0-dev.0`, is shown as it is: its features are
marked "Coming soon", not in a stable release, and the version says these
are the docs for one in progress. It's small, regular weight, and gray,
since it's for reference, not navigation. On the current page, whose item
has the accent's background, it's the item's text color, since gray on
the accent was hard to read. Rejected:
- No version for a prerelease. A reader couldn't tell whether they were
  reading about a stable release or something newer.
- A prerelease's version without its suffix. `2.1.0-dev.0` would be
  "v2.1.0" while its features were still "Coming soon".
- The last stable release, from npm or tags. It needs the network or full
  clones, and before a major release it would be a version the docs don't
  describe.

## Releasing

Each repo's `version` script, `scripts/version-docs.js`, replaces
`*Coming soon*` in `website/` with `*Added in vX.Y.Z*` and stages it. npm runs
it after `npm version` bumps `package.json` and before it commits, so the
markers are part of the version commit. A prerelease, like `2.1.0-dev.0`,
leaves them, since what's in it is still coming soon. The script is the same
in each repo, rather than a package they share, because it's a few lines.
