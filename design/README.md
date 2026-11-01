# Design

One site for `json-schema`, `cli`, `browser`, and the other packages. The docs stay in each repo's
`website/`, so a change and its docs land in the same commit. This repo gets
them, rewrites what GitHub-flavored docs need for a site, and deploys it.

## Style

How to write docs in every repo, including this one, is in
[style/](style/README.md): the Google developer documentation style guide,
checked by Vale.

## Writing docs

How to write docs for the site, in every repo.

- [Pages](authoring/pages.md): titles, and the page list that sets the
  sidebar
- [Links](authoring/links.md): links between pages and repos, and moving
  a page
- [Code blocks](authoring/code-blocks.md): schemas, JRef, and wrapping
- [Code examples](authoring/examples.md): TypeScript, realistic code, and
  results
- [Options and methods](authoring/options-and-methods.md): tables and
  signatures
- [Version markers](components/version-markers.md): when a feature was
  added, or that it's coming soon
- [Lint rule pages](authoring/lint-rule-pages.md): examples and the
  messages they report
- [Blog posts](authoring/posts.md): files and frontmatter
- [Adding a package](authoring/adding-a-package.md): `sources.js`,
  rebuilding the site, and the style check

## Components

- [Content](components/content.md): one site, where its pages come from, and
  why branch heads and not release tags
- [Links](components/links.md): links written for GitHub, and checking them
- [Version markers](components/version-markers.md): when a feature was added
- [Sidebar](components/sidebar.md): topics by where packages are used,
  built from each package's README
- [Look](components/look.md): Starlight with Hyperjump's logo, sage-olive green, and a
  landing page
- [Landing page](components/landing-page.md): JSON Schema tools, and the
  components they're built from
- [JSON Schema highlighting](components/highlighting.md): keywords and
  property names in schema examples
- [Code block labels](components/code-labels.md): what each block is,
  like "JSON Schema · 2020-12"
- [Reporter output](components/reporter-output.md): the CLI's output,
  colored like it is in a terminal
- [Blog](components/blog.md): dated posts, written here, beside docs
  that are always current
- [Tooling](components/tooling.md): Starlight, and Astro's markdown processor
- [Deployment](components/deployment.md): GitHub Pages, and rebuilding when
  docs change
