# Sidebar

Each section's sidebar is the nested list in its `website/README.md`, in the
same order, so a repo decides its own navigation in the same commit as its
pages. `sidebar.js` reads the list:

- A linked item is a page.
- An item without a link, like "Usage", is a group.
- A linked item with children is a group that starts with its own page, as
  "Overview", since a Starlight group can't be a link.

## Known limitations

- Every section is in one sidebar. A sidebar per section would need a plugin
  like `starlight-sidebar-topics`.
