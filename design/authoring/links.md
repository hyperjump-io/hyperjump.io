# Links

Write links that work on GitHub. The site rewrites them for its own paths.

- To link to a page in the same repo, use a relative link, such as
  `../guides/validating.md`.
- To link to a page in another repo's docs, use a GitHub link into its
  `website/` directory, such as
  `https://github.com/hyperjump-io/cli/blob/main/website/README.md`.

A broken link fails the build.

## Moving a page

When you move a page or merge it into another, add its old path to
`redirects.js` in the `hyperjump.io` repo. Links to the old path then keep
working.

For how links are rewritten and checked, see
[Links](../components/links.md).
