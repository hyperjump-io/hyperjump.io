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
