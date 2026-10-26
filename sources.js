import { resolve } from "node:path";

// Each repo's website/ becomes a section of the site, built from the head
// of `ref`. `icon` is the section's icon in the sidebar's list of sections,
// one of Starlight's built-in icons. Set LOCAL_REPOS to a directory holding checkouts of the repos to
// build from those instead.
export const sources = [
  { repo: "json-schema", ref: "v2", section: "json-schema", label: "JSON Schema", icon: "seti:json" },
  { repo: "hjlint", ref: "main", section: "hjlint", label: "hjlint", icon: "seti:shell" },
  { repo: "browser", ref: "v2", section: "browser", label: "Browser", icon: "link" }
];

export const localRepos = process.env.LOCAL_REPOS;

export const repoUrl = (source) => `https://github.com/hyperjump-io/${source.repo}.git`;

export const repoDir = (source) => localRepos
  ? resolve(localRepos, source.repo)
  : resolve(".cache/repos", source.repo);

export const websiteDir = (source) => resolve(repoDir(source), "website");
