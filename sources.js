import { resolve } from "node:path";

// Where packages are used: the sidebar's topics and the landing page's
// groups, in order. `icon` is the topic's icon in the sidebar's list of
// topics, one of Starlight's built-in icons. `description` is the line
// under the group's heading on the landing page. A topic with `list` has one
// card there with a list of links, instead of a card for each package, so a
// group of many packages stays short. `list` is the text of the card's link
// to the topic's front page.
export const topics = [
  {
    id: "code",
    label: "In your code",
    icon: "seti:json",
    description: "Libraries for Node.js and browsers."
  },
  {
    id: "terminal",
    label: "In your terminal",
    icon: "seti:shell",
    description: "On your machine and in CI."
  },
  {
    id: "components",
    label: "Components",
    icon: "puzzle",
    description: "Build your own JSON Schema and hypermedia tools from the libraries ours are built from.",
    list: "All components"
  }
];

// Each repo's website/ becomes a package's pages, at /<repo>/, built from
// the head of `ref`. `topic` is the topic it's listed in. `description` and
// `command`, which installs or runs it, are for its card. `summary` is for
// a topic with `list`: a few words beside its link, short enough not to
// wrap. Set
// LOCAL_REPOS to a directory holding checkouts of the repos to build from
// those instead.
export const sources = [
  {
    repo: "json-schema",
    ref: "v2",
    topic: "code",
    label: "JSON Schema",
    description: "A validator and linter for every dialect from draft-04 to 2020-12, and JSON Schema v1. Errors with positions in the JSON text, and annotations.",
    command: "npm install @hyperjump/json-schema"
  },
  {
    repo: "hjlint",
    ref: "main",
    topic: "terminal",
    label: "hjlint",
    description: "Lints schemas and validates JSON files against them, with the same rules as the library.",
    command: "npx hjlint ."
  },
  {
    repo: "browser",
    ref: "v2",
    topic: "components",
    label: "Browser",
    summary: "JRef hypermedia browser",
    description: "A client for JSON documents that reference each other, over HTTP or from files, that follows references for you.",
    command: "npm install @hyperjump/browser"
  },
  {
    repo: "json-pointer",
    ref: "main",
    topic: "components",
    label: "JSON Pointer",
    summary: "RFC 6901 pointers",
    description: "Get, set, and remove values in a JSON document by RFC 6901 JSON Pointer.",
    command: "npm install @hyperjump/json-pointer"
  },
  {
    repo: "pact",
    ref: "v2",
    topic: "components",
    label: "Pact",
    summary: "Iterator pipelines",
    description: "Higher order functions for iterators and async iterators, as steps in a pipeline, with the native Iterator helpers' names.",
    command: "npm install @hyperjump/pact"
  }
];

export const localRepos = process.env.LOCAL_REPOS;

export const repoUrl = (source) => `https://github.com/hyperjump-io/${source.repo}.git`;

export const repoDir = (source) => localRepos
  ? resolve(localRepos, source.repo)
  : resolve(".cache/repos", source.repo);

export const websiteDir = (source) => resolve(repoDir(source), "website");
