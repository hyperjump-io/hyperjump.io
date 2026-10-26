// Each section is a sidebar topic, with a sidebar of its own built from the
// nested list in its website/README.md. A linked item with children becomes a
// group that starts with its own page. Every page under a section is in its
// topic, listed or not. A topic's badge is its package's version, which
// features marked "Added in" a later one are newer than.
import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { markdownToMdast } from "satteri";
import { sources, repoDir, websiteDir } from "./sources.js";

export const topics = sources.map((source) => {
  const { section, label, icon } = source;
  const tree = markdownToMdast(readFileSync(`${websiteDir(source)}/README.md`, "utf8"));
  const list = contentsList(tree) ?? tree.children.find((node) => node.type === "list");
  if (!list) throw Error(`${source.repo}: website/README.md has no list of pages`);
  return {
    id: section,
    label,
    icon,
    badge: versionBadge(source),
    link: `/${section}/`,
    items: [
      { label: "Overview", link: `/${section}/` },
      ...list.children.map((item) => toItem(item, section))
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

export const topicPages =Object.fromEntries(sources.map(({ section }) => [section, [`/${section}/**/*`]]));

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

function versionBadge(source) {
  const { version } = JSON.parse(readFileSync(`${repoDir(source)}/package.json`, "utf8"));
  return { text: `v${version}`, variant: "default" };
}
