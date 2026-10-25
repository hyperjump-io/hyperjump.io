# Sidebar

Each package has a sidebar of its own. `starlight-sidebar-topics` makes each
section a topic, with links at the top of the sidebar to switch between them.
A page under `/<section>/` is in that section's topic, whether its sidebar
lists it or not, like each lint rule's page. The landing page isn't in a
topic. It's a splash page, without a sidebar.

A section's sidebar is the nested list in its `website/README.md`, in the
same order, so a repo decides its own navigation in the same commit as its
pages. It's the first list after a heading named "Contents", or the first
list on the page if there's no such heading. The heading lets a section's
front page start with an introduction that has lists of its own, like a
list of features, before its table of contents. `sidebar.js` reads the
list:

- A linked item is a page.
- An item without a link, like "Usage", is a group.
- A linked item with children is a group that starts with its own page, as
  "Overview", since a Starlight group can't be a link.

A section with [API pages](api.md) ends with their group. The topics plugin
has to come before the TypeDoc plugins in `astro.config.mjs`. It makes the
sidebar that their groups are put in, and the other way around, the groups
are left out.

Rejected: one sidebar with every package. It's long, and someone reading
json-schema's docs rarely needs browser's pages next to them.
