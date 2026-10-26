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

The tagline claims only what's on the site. Editors, test coverage, and
JSONC and YAML go in it when they're documented here.

"Try it online", the playground, is the hero's main action. It's the one
way in that needs no install, and there's no one package to start with.

## Groups

Packages are grouped by where they're used: "In your code", "On the command
line", and "Components". Later, "In your editor" for the language server
and extensions, and "In your tests" for coverage. Each group has a heading,
one line on what's in it, and a card for each package.

The groups are columns, side by side when there's room. Each one's
heading, description, and cards are rows of a subgrid, so cards line up
across groups whose headings or descriptions wrap differently. When
Components outgrows a column, it goes below the others, full width.

A card, `src/components/PackageCard.astro`, is one link to the package's
docs, with what it is and the command that installs or runs it. Formats a
tool reads, like JSONC or YAML, go on its card, not in a group of their
own, since they're true of many tools.

Components are the libraries the tools are built from: browser, and later
uri, uri-template, json-pointer, json, pact, and others. Pact has nothing
to do with JSON Schema, and fits here because each component stands alone.
Browser is one, though it has a section of its own.

The 1.x docs of `@hyperjump/json-schema` are linked below the groups,
called "1.x" and not "v1" so it isn't confused with the JSON Schema v1
dialect. The package goes by its npm name, not "the JSON Schema library",
which could be any of them.

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
