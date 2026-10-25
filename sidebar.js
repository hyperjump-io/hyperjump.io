// Each section is a sidebar topic, with a sidebar of its own built from the
// nested list in its website/README.md. A linked item with children becomes a
// group that starts with its own page. A section with API pages ends with
// their group. Every page under a section is in its topic, listed or not.
import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { markdownToMdast } from "satteri";
import { apis } from "./api.js";
import { sections, websiteDir } from "./sources.js";

export const topics = sections.map((source) => {
  const { section, label } = source;
  const tree = markdownToMdast(readFileSync(`${websiteDir(source)}/README.md`, "utf8"));
  const list = contentsList(tree) ?? tree.children.find((node) => node.type === "list");
  if (!list) throw Error(`${source.repo}: website/README.md has no list of pages`);
  return {
    id: section,
    label,
    link: `/${section}/`,
    items: [
      { label: "Overview", link: `/${section}/` },
      ...list.children.map((item) => toItem(item, section)),
      ...apis.filter((api) => api.section === section).map((api) => api.sidebarGroup)
    ]
  };
});

// The first list after a "Contents" heading, so the page can have other lists
// before it, like a list of features
function contentsList(tree) {
  const heading = tree.children.findIndex((node) => node.type === "heading" && toString(node).trim() === "Contents");
  if (heading === -1) return undefined;
  return tree.children.slice(heading + 1).find((node) => node.type === "list");
}

export const topicPages =Object.fromEntries(sections.map(({ section }) => [section, [`/${section}/**/*`]]));

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
