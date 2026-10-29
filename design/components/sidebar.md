# Sidebar

The sidebar's topics are where packages are used, the same groups as the
[landing page](landing-page.md): "In your code", "In your terminal",
"In your tests", "Components", and later "In your editor". Each topic
has a sidebar of its own. `starlight-sidebar-topics` puts links to the
topics at the top of the sidebar to switch between them. The landing page
isn't in a topic. It's a splash page, without a sidebar.

`sources.js` lists the topics, in order, and gives each package a topic.
A package's pages are at `/<repo>/` whatever its topic, so moving it to
another topic doesn't change its URLs. A page under `/<repo>/` is in its
package's topic, whether the sidebar lists it or not, like each lint
rule's page.

Rejected: a topic for each package, with small components sharing one
"Components" topic. There will be a dozen or more packages, and the
language server, the VS Code extension, and json-schema-coverage aren't
components, so each would be a topic. A list of more than six or so
topics pushes the page links down, and would need a dropdown. Where
packages are used is a short list that grows slowly.

Each topic has an icon in the list of topics, set in `sources.js`, and the
current topic has a tinted background. Without them, the list looked like
more page links, and in the light theme, the current topic was only green
text. The icons are Starlight's built-in ones: `{ }` for code, `$` for the
terminal, a check mark for tests, and the puzzle piece for components.

## A topic's sidebar

A topic with one package, like "In your code", is that package's sidebar,
and its first item is the package's front page, under the package's
name, not "Overview", since the topic's name doesn't say which package it
is. The package's version is that item's badge (see
[Version markers](version-markers.md#the-current-version)), not the
topic's, since a topic is where packages are used, which has no version. Showing the
package as a group of its own would be a level that only repeats the
topic.

A topic with more than one, like "Components", starts with a front page
of its own, at `/<topic>/`, that's this repo's, with a card for each of
its packages. Each
package is an item after it, with its version as a badge: a group of its
pages, collapsed unless the current page is in it, or a link if it has
only one page.

A package's pages are the nested list under the "Contents" heading of its
`website/README.md`, in the same order, so a repo decides its own
navigation in the same commit as its pages. The heading lets a package's
front page have lists of its own, like a list of features or its API,
which aren't pages. Without the heading, the package has one page. A
package whose docs are [coming soon](content.md#where-pages-come-from)
has only its placeholder, with "Coming soon" as its badge, since its
version on the branch isn't what the docs will describe. `sidebar.js`
reads the list:

- A linked item is a page.
- An item without a link, like "Usage", is a group.
- A linked item with children is a group that starts with its own page, as
  "Overview", since a Starlight group can't be a link.

Rejected:
- One sidebar with every package. It's long, and someone reading
  json-schema's docs rarely needs browser's pages next to them.
- The first list on the page when there's no "Contents" heading. A
  one-page component's API is a list, and was taken for its pages.
