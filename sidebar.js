// Each topic in sources.js has a sidebar of its own, with links at the top
// of the sidebar to switch between them. A package's pages are the nested
// list under the "Contents" heading of its website/README.md. A linked item
// with children becomes a group that starts with its own page. Every page
// under /<repo>/ is in its package's topic, listed or not.
//
// A topic with one package is that package's sidebar, starting with its
// front page under the package's name, with its version as the badge. A
// topic with more starts with its own front page, /<topic>/, which is this
// repo's, and each package is an item with its version as its badge: a
// group of its pages, or a link if it has one page.
// Features marked "Added in" a later version than a badge are newer than it.
// A package without docs yet has only its placeholder front page, with
// "Coming soon" as its badge.
import { readFileSync } from "node:fs";
import { posix } from "node:path";
import { markdownToMdast } from "satteri";
import { topics as topicList, sources, repoDir, websiteDir, hasDocs } from "./sources.js";

const packagesOf = (topic) => sources.filter((source) => source.topic === topic.id);

export const topics = topicList.map((topic) => {
  const { id, label, icon } = topic;
  const packages = packagesOf(topic);
  if (packages.length === 0) throw Error(`The ${id} topic has no packages`);
  if (packages.length === 1) {
    const [source] = packages;
    return {
      id,
      label,
      icon,
      link: `/${source.repo}/`,
      items: [{ label: source.label, link: `/${source.repo}/`, badge: versionBadge(source) }, ...pages(source)]
    };
  }
  return {
    id,
    label,
    icon,
    link: `/${id}/`,
    items: [
      { label: "Overview", link: `/${id}/` },
      ...packages.map((source) => {
        const link = `/${source.repo}/`;
        const badge = versionBadge(source);
        const items = pages(source);
        if (items.length === 0) return { label: source.label, link, badge };
        return { label: source.label, badge, collapsed: true, items: [{ label: "Overview", link }, ...items] };
      })
    ]
  };
});

export const topicPages = Object.fromEntries(topicList.map((topic) => {
  const packages = packagesOf(topic);
  const front = packages.length > 1 ? [`/${topic.id}/`] : [];
  return [topic.id, [...front, ...packages.map(({ repo }) => `/${repo}/**/*`)]];
}));

// The list after the "Contents" heading, so the page can have other lists
// before it, like a list of features. Without one, the package has only its
// front page.
function pages(source) {
  if (!hasDocs(source)) return [];
  const tree = markdownToMdast(readFileSync(`${websiteDir(source)}/README.md`, "utf8"));
  const heading = tree.children.findIndex((node) => node.type === "heading" && toString(node).trim() === "Contents");
  if (heading === -1) return [];
  const list = tree.children.slice(heading + 1).find((node) => node.type === "list");
  return list?.children.map((item) => toItem(item, source.repo)) ?? [];
}

function toItem(listItem, repo) {
  const [paragraph, sublist] = listItem.children;
  const link = paragraph.children.find((node) => node.type === "link");
  const label = toString(link ?? paragraph).trim();
  const items = sublist?.children.map((item) => toItem(item, repo)) ?? [];
  if (!link) return { label, items };
  const page = { label, link: toSlug(posix.join(repo, link.url)) };
  return items.length ? { label, collapsed: true, items: [{ ...page, label: "Overview" }, ...items] } : page;
}

function toString(node) {
  return node.value ?? node.children?.map(toString).join("") ?? "";
}

function toSlug(path) {
  return "/" + path.replace(/(^|\/)README\.md$/, "$1").replace(/\.md$/, "/");
}

function versionBadge(source) {
  if (!hasDocs(source)) return { text: "Coming soon", variant: "default" };
  const { version } = JSON.parse(readFileSync(`${repoDir(source)}/package.json`, "utf8"));
  return { text: `v${version}`, variant: "default" };
}
