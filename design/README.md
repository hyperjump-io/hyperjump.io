# Design

One site for json-schema, hjlint, and browser. The docs stay in each repo's
`website/`, so a change and its docs land in the same commit. This repo gets
them, rewrites what GitHub-flavored docs need for a site, and deploys it.

## Components

- [Content](components/content.md): one site, where its pages come from, and
  why branch heads and not release tags
- [Links](components/links.md): links written for GitHub, and checking them
- [Version markers](components/version-markers.md): when a feature was added
- [Sidebar](components/sidebar.md): built from each section's README
- [Look](components/look.md): Starlight with Hyperjump's logo, sage-olive green, and a
  landing page
- [Landing page](components/landing-page.md): JSON Schema tools, and the
  components they're built from
- [JSON Schema highlighting](components/highlighting.md): keywords and
  property names in schema examples
- [Reporter output](components/reporter-output.md): hjlint's output,
  colored like it is in a terminal
- [Tooling](components/tooling.md): Starlight, and Astro's markdown processor
- [Deployment](components/deployment.md): GitHub Pages, and rebuilding when
  docs change
