# Blog

Posts are in `src/content/docs/blog/`, written here, not copied from a
repo. `starlight-blog` makes the post list, tag and author pages, and an
RSS feed at `/blog/rss.xml`. It adds a "Blog" link to the header, and an
RSS icon beside GitHub's.

## Docs and posts

The docs say how things work now, and they're edited as that changes.
There's [one version of them](content.md#one-version-from-branch-heads). A
post is dated, and isn't updated after it's published: a release, why a
design changed, or how a migration went. It links to the docs for how
things work, and doesn't repeat them, so it can go out of date without
misleading anyone. Release notes stay in each repo.

Posts are markdown like the docs, with the same code blocks, schema
highlighting, and link checking.

## Sidebar

The blog isn't a package's, so it's excluded from the
[sidebar topics](sidebar.md), and `starlight-blog` gives its pages a
sidebar of their own: all posts, recent posts, tags, and RSS. The plugin
is after `starlight-sidebar-topics` in `astro.config.mjs`, so its sidebar
replaces the one Starlight builds for pages that aren't in a topic. On
small screens, where the header has no room for the "Blog" link, it's at
the end of each topic's list of sections.

Rejected: a blog on a site of its own. Its posts wouldn't be in the docs'
search, and its links into the docs wouldn't be checked.

## Known limitations

- `starlight-blog` works with satteri and with Astro's remark processor,
  so it installs the remark and MDX packages, which the site doesn't use.
