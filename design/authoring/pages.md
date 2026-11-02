# Pages

A package's docs are plain Markdown files in its repo's `website/`
directory. Write them so they read well on GitHub. The site build handles
the rest.

## Titles

Start each page with an H1. The site uses it as the page's title. A page
that doesn't start with an H1 fails the build.

## The page list

`website/README.md` is the package's front page. List the package's pages
in it as a nested list under a `Contents` heading. The site builds the
package's sidebar from that list, in the same order.

A package without a `Contents` heading has one page.

For how the site builds the sidebar, see [Sidebar](../components/sidebar.md).

## The first sentence

Start `website/README.md` with a complete sentence whose subject is the
package, and that says what it does, like "The Hyperjump browser is a
hypermedia client for JRef." Don't start with a noun phrase like "A JSON
Schema validator for JavaScript." It reads like a tagline with no subject.

Rejected: a Vale rule. Vale can't parse grammar, and a list of verbs to
look for flags good sentences and misses bad ones.
