// Builds each section's sidebar from the nested list in its website/README.md.
// A linked item with children becomes a group that starts with its own page.
// A section with API pages ends with their group.
import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { markdownToMdast } from "satteri";
import { apis } from "./api.js";
import { sections, websiteDir } from "./sources.js";

export const sidebar = sections.map((source) => {
  const { section, label } = source;
  const tree = markdownToMdast(readFileSync(`${websiteDir(source)}/README.md`, "utf8"));
  const list = tree.children.find((node) => node.type === "list");
  if (!list) throw Error(`${source.repo}: website/README.md has no list of pages`);
  return {
    label,
    items: [
      { label: "Overview", link: `/${section}/` },
      ...list.children.map((item) => toItem(item, section)),
      ...apis.filter((api) => api.section === section).map((api) => api.sidebarGroup)
    ]
  };
});

function toItem(listItem, section) {
  const [paragraph, sublist] = listItem.children;
  const link = paragraph.children.find((node) => node.type === "link");
  const label = toString(link ?? paragraph).trim();
  const items = sublist?.children.map((item) => toItem(item, section)) ?? [];
  if (!link) return { label, items };
  const page = { label, link: toSlug(posix.join(section, link.url)) };
  return items.length ? { label, collapsed: true, items: [{ ...page, label: "Overview" }, ...items] } : page;
}

function toString(node) {
  return node.value ?? node.children?.map(toString).join("") ?? "";
}

function toSlug(path) {
  return "/" + path.replace(/(^|\/)README\.md$/, "$1").replace(/\.md$/, "/");
}
