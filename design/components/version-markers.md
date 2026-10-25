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

## Releasing

Each repo's `version` script, `scripts/version-docs.js`, replaces
`*Coming soon*` in `website/` with `*Added in vX.Y.Z*` and stages it. npm runs
it after `npm version` bumps `package.json` and before it commits, so the
markers are part of the version commit. A prerelease, like `2.1.0-dev.0`,
leaves them, since what's in it is still coming soon. The script is the same
in each repo, rather than a package they share, because it's a few lines.
