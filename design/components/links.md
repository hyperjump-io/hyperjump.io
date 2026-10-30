# Links

Authors write links that work on GitHub, and `plugins/site-links.js` rewrites
them for the site:

- A relative link to a page becomes the page's site path.
  `../guides/validating.md` from `json-schema/linting/` is `/json-schema/guides/validating/`,
  and `README.md` is the package or folder's index.
- A GitHub link into another repo's `website/`
  (`https://github.com/hyperjump-io/<repo>/blob/<ref>/website/...`) becomes the
  site path of that page.
- A relative link that leaves `website/`, into `src/` or `design/`, becomes a
  GitHub link at the repo's branch, since those aren't on the site.
- Anything else is left alone, including a link to a heading on the same
  page (`#json-text`).

A link into a package without [docs here yet](content.md#where-pages-come-from)
goes to its placeholder, its only page, on any page, this repo's too. So
a package's docs can link to another's before that one has docs, and
neither a reader nor the link check finds a missing page. The heading in
the link is dropped, since the placeholder doesn't have it.

## Redirects

A page that moves or is merged into another keeps working at its old path.
`redirects.js` maps old paths to where their content is now, and Astro
builds a page at each old path that redirects there. It's in this repo, not
the docs repos, because the site's paths are this repo's: a repo moving a
page changes its own docs, and the redirect is a change to the site.

Rejected: leaving old paths to 404. Links to them from other sites, search
results, and bookmarks would break with every reorganization.

## Checking

`starlight-links-validator` fails the build on a link to a page or heading
that doesn't exist. The repos change independently, so a page renamed in one
breaks links in another without anyone noticing. The site build is the one
place all three are put together, so it's where those are caught.

It doesn't check where a redirect in `redirects.js` goes, either. A
redirect to a page that's later moved again has to be updated by hand.
