# Links

Authors write links that work on GitHub, and `plugins/site-links.js` rewrites
them for the site:

- A relative link to a page becomes the page's site path.
  `../guides/validating.md` from `json-schema/linting/` is `/json-schema/guides/validating/`,
  and `README.md` is the section or folder's index.
- A GitHub link into another repo's `website/`
  (`https://github.com/hyperjump-io/<repo>/blob/<ref>/website/...`) becomes the
  site path of that page.
- A relative link that leaves `website/`, into `src/` or `design/`, becomes a
  GitHub link at the repo's branch, since those aren't on the site.
- A link to `https://hyperjump.io/...` becomes a site path. TypeDoc writes
  links to another package's API that way.
- Anything else is left alone, including a link to a heading on the same
  page (`#json-text`).

## Checking

`starlight-links-validator` fails the build on a link to a page or heading
that doesn't exist. The repos change independently, so a page renamed in one
breaks links in another without anyone noticing. The site build is the one
place all three are put together, so it's where those are caught.

It doesn't check a heading anchor in a link from a generated API page. See
[API reference](api.md).
