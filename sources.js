import { resolve } from "node:path";

// Each repo's website/ becomes a section of the site, built from the head
// of `ref`. A repo with `api` also gets API reference pages, generated from
// its declaration files, which needs the whole repo and its dependencies. A
// repo without a `section` is only a dependency of one with `api`, linked
// with `file:`. Set LOCAL_REPOS to a directory holding checkouts of the
// repos to build from those instead.
export const sources = [
  { repo: "json-schema", ref: "v2", section: "json-schema", label: "JSON Schema", api: true },
  { repo: "hjlint", ref: "main", section: "hjlint", label: "hjlint" },
  { repo: "browser", ref: "v2", section: "browser", label: "Browser", api: true },
  { repo: "uri", ref: "main" }
];

export const sections = sources.filter((source) => source.section);

export const localRepos = process.env.LOCAL_REPOS;

export const repoUrl = (source) => `https://github.com/hyperjump-io/${source.repo}.git`;

export const repoDir = (source) => localRepos
  ? resolve(localRepos, source.repo)
  : resolve(".cache/repos", source.repo);

export const websiteDir = (source) => resolve(repoDir(source), "website");

// Only website/ is needed for a section's pages.
export const needsWholeRepo = (source) => source.api || !source.section;
