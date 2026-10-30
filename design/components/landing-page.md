# Landing page

`src/content/docs/index.mdx`, one of the few pages written here, and in
MDX for its components. It's a splash page, without a sidebar.

## What it says

Hyperjump is JSON Schema tools, and the components they're built from,
each of which installs and works on its own. It's the framing of Symfony,
"a set of reusable components and a framework". JSON Schema is the focus,
so it leads: the heading is "JSON Schema tools", and the tagline says what
they do, then "Use the whole toolkit, or just the pieces you need." The
header already says Hyperjump, so the hero doesn't repeat it.

The page has two audiences. First, people who want to validate or lint
schemas today, who the hero is for. Second, people building their own
JSON Schema and hypermedia tools, who the Components group is for: its
description offers them the libraries Hyperjump's tools are built from.
"Tools for building tools" isn't in the hero. It's abstract, and would
leave the first audience wondering whether the site is for them.
"Hypermedia" is in the Components group, next to browser, an example of
it, and not in the hero, where it would be jargon.

The tagline claims only what's on the site. "Test" is in it for
json-schema-coverage. Editors, and JSONC and YAML, go in it when they're
documented here.

"Try it online", the playground, is the hero's main action. It's the one
way in that needs no install, and there's no one package to start with.

## Groups

Packages are grouped by where they're used: "In your code", "In your
terminal", "In your editor" for the language server and its editor
extensions, "In your tests" for json-schema-coverage, and "Components".
Each group has a heading, one line on what's in it, and a card for each
package, or one card with a list of links.

The groups are the sidebar's topics (see [Sidebar](sidebar.md)).
`src/components/PackageGroups.astro` builds them from the topics and
packages in `sources.js`, which has each group's line and each card's
text, so a new package is one entry there, and the page and the sidebar
can't disagree. Rejected: groups written in the page's MDX. A group's
heading had to match its topic's label by hand.

"In your terminal", not "On the command line": it's where you are, like
the other groups' names, and not what you're using.

The groups are two columns, side by side when there's room. Each one's
heading, description, and cards are rows of a subgrid, so cards line up
across groups whose headings or descriptions wrap differently. Cards
stretch so the groups in a row end together. Components, the group with
a list card, is a row of its own after the others, the page's width,
with its list in two columns. Rejected: as many columns as fit, three on
a laptop. With five groups, the fourth sat beside Components, and its
card stretched to the list's height.

A card, `src/components/PackageCard.astro`, is one link to the package's
docs, with what it is and the command that installs or runs it. Formats a
tool reads, like JSONC or YAML, go on its card, not in a group of their
own, since they're true of many tools. A package that
[isn't released](content.md#where-pages-come-from) ends with "Coming
soon", like a version marker, in place of a command that wouldn't work
yet. A released package without docs here has its command, like any
other.

Components are the libraries the tools are built from: browser,
json-pointer, json-schema-errors, json-schema-formats, pact, uri,
uri-template, and later json and others. json-schema-errors is used
next to any validator, not only ours, so it stands alone like the rest.
Rejected: json-schema-errors in "In your code". The group had two cards,
and the single cards beside it stretched to their height. Pact
has nothing to do with JSON Schema, and fits here because each component
stands alone. Browser is one.

There will be a dozen or more, so Components has one card,
`src/components/PackageListCard.astro`, with a list of links, each with a
few words beside it, its `summary` in `sources.js`, short enough not to
wrap. At the bottom, where a package's card has its command, is a link to
the Components page, which has a card for each
(`src/components/Packages.astro`). The card isn't one link, like a
package's card, since it has links in it. A topic gets a card like this
with `list` in `sources.js`. Rejected:
- A card for each component. The group would be longer than the rest of
  the page, and uri-template would look as important as the language
  server.
- A list of links without a card. It didn't line up with the other
  groups' cards.
- One "All components" card, naming them. It said too little to choose
  from, and its list of names would get long.

A package's older major versions aren't on the landing page. Its
overview links them, like json-schema's link to its 1.x README, since
that's where people using it look, and the landing page would need a
line for each package with one.

Rejected:

- **A card per package, all the same.** With a dozen packages, uri-template
  would look as important as the language server.
- **A group for each format.** JSONC and YAML would be lists of links to
  other groups.
- **The hjlint output as the hero's picture.** It shows linting,
  validation, and positions at once, but makes one tool the face of all of
  them.
- **"Get started" to json-schema.** People who came for hjlint had to find
  their own way.
- **The 1.x docs of `@hyperjump/json-schema` linked below the groups.**
  It was one package's line on a page about all of them.

## Recent posts

Below the groups are the two newest [blog posts](blog.md), a card each,
with the date, title, and excerpt, and a link to all posts.
`src/components/RecentPosts.astro` gets them from `starlight-blog`.
They're last, so the packages, which the page is for, come first. They're
in the groups' two columns, so their cards line up with the package
cards, in one row. Rejected: three, which wrapped to two and one.

Before the first post, the section is one card that says posts are
coming soon, like a package's card before its docs, so the page doesn't
change shape when the blog starts. It isn't a link, and there's no "All
posts" link, since the blog has nothing more to show.
