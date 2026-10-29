// Rewrites links written for GitHub into site paths: relative links to .md
// files, and GitHub links into another repo's website/. A relative link that
// leaves website/ (into src/ or design/, say) becomes a GitHub link. On any
// page, this repo's too, a link into a repo whose docs are coming soon goes
// to its placeholder front page, the only page it has.
import { fileURLToPath } from "node:url";
import { posix } from "node:path";
import { defineMdastPlugin } from "satteri";
import { sources, hasDocs } from "../sources.js";

const docsRoot = "/src/content/docs/";
const github = /^https:\/\/github\.com\/hyperjump-io\/([^/]+)\/blob\/[^/]+\/website\/(.*)$/;

export default function siteLinks({ fileURL }) {
  if (!fileURL) return null;
  const path = fileURLToPath(fileURL);
  const page = path.slice(path.indexOf(docsRoot) + docsRoot.length);
  const source = sources.find(({ repo }) => page.startsWith(`${repo}/`));

  const rewrite = (node, ctx) => {
    const url = siteUrl(node.url, page, source);
    if (url !== node.url) ctx.setProperty(node, "url", url);
  };
  return defineMdastPlugin({ name: "site-links", link: rewrite, definition: rewrite });
}

function siteUrl(href, page, source) {
  const hashStart = href.includes("#") ? href.indexOf("#") : href.length;
  const url = href.slice(0, hashStart);
  const hash = href.slice(hashStart);
  const fromGithub = github.exec(url);
  if (fromGithub) {
    const target = sources.find(({ repo }) => repo === fromGithub[1]);
    if (!target) return href;
    if (!hasDocs(target)) return `/${target.repo}/`;
    return toSlug(posix.join(target.repo, fromGithub[2])) + hash;
  }
  const placeholder = sources.find((target) => url.startsWith(`/${target.repo}/`) && !hasDocs(target));
  if (placeholder) return `/${placeholder.repo}/`;
  // This repo's pages are written for the site, not GitHub.
  if (!source) return href;
  if (url === "" || /^[a-z][a-z0-9+.-]*:|^\//i.test(url)) return href;

  const resolved = posix.join(posix.dirname(page), url);
  if (resolved.startsWith(`${source.repo}/`)) return toSlug(resolved) + hash;
  const inRepo = posix.join("website", posix.relative(source.repo, resolved));
  const kind = posix.extname(inRepo) ? "blob" : "tree";
  return `https://github.com/hyperjump-io/${source.repo}/${kind}/${source.ref}/${inRepo}${hash}`;
}

function toSlug(path) {
  return "/" + path.replace(/(^|\/)(README|index)\.md$/, "$1").replace(/\.md$/, "/");
}
