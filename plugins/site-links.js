// Rewrites links written for GitHub into site paths: relative links to .md
// files, and GitHub links into another repo's website/. A relative link that
// leaves website/ (into src/ or design/, say) becomes a GitHub link. A link to
// https://hyperjump.io/, like one TypeDoc makes to another package's API, is
// made a site path, so it's checked.
import { fileURLToPath } from "node:url";
import { posix } from "node:path";
import { defineMdastPlugin } from "satteri";
import { sections } from "../sources.js";

const docsRoot = "/src/content/docs/";
const site = "https://hyperjump.io/";
const github = /^https:\/\/github\.com\/hyperjump-io\/([^/]+)\/blob\/[^/]+\/website\/(.*)$/;

export default function siteLinks({ fileURL }) {
  if (!fileURL) return null;
  const path = fileURLToPath(fileURL);
  const page = path.slice(path.indexOf(docsRoot) + docsRoot.length);
  const source = sections.find(({ section }) => page.startsWith(`${section}/`));
  if (!source) return null;

  const rewrite = (node, ctx) => {
    const url = siteUrl(node.url, page, source);
    if (url !== node.url) ctx.setProperty(node, "url", url);
  };
  return defineMdastPlugin({ name: "site-links", link: rewrite, definition: rewrite });
}

function siteUrl(href, page, source) {
  if (href.startsWith(site)) return href.slice(site.length - 1);
  const [url, hash = ""] = href.split(/(?=#)/);
  const fromGithub = github.exec(url);
  if (fromGithub) {
    const target = sections.find(({ repo }) => repo === fromGithub[1]);
    return target ? toSlug(posix.join(target.section, fromGithub[2])) + hash : href;
  }
  if (url === "" || /^[a-z][a-z0-9+.-]*:|^\//i.test(url)) return href;

  const resolved = posix.join(posix.dirname(page), url);
  if (resolved.startsWith(`${source.section}/`)) return toSlug(resolved) + hash;
  const inRepo = posix.join("website", posix.relative(source.section, resolved));
  const kind = posix.extname(inRepo) ? "blob" : "tree";
  return `https://github.com/hyperjump-io/${source.repo}/${kind}/${source.ref}/${inRepo}${hash}`;
}

function toSlug(path) {
  return "/" + path.replace(/(^|\/)(README|index)\.md$/, "$1").replace(/\.md$/, "/");
}
