import { existsSync } from "node:fs";
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
    id: "editor",
    label: "In your editor",
    icon: "pencil",
    description: "Schema-aware editing for JSON, in VS Code and Neovim."
  },
  {
    id: "tests",
    label: "In your tests",
    icon: "approve-check-circle",
    description: "See which parts of your schemas your tests reach."
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
// `command`, which installs or runs it, are for its card. A package
// without a command, like an editor's, has none on its card. `summary` is for
// a topic with `list`: a few words beside its link, short enough not to
// wrap. `install` checks out the whole repo and installs its dependencies,
// not just website/, for a package the build runs, like json-schema for
// the schema highlighter. Set
// LOCAL_REPOS to a directory holding checkouts of the repos to build from
// those instead.
export const sources = [
  {
    repo: "json-schema",
    ref: "main",
    install: true,
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
    repo: "json-language-server",
    ref: "main",
    topic: "editor",
    label: "JSON Language Server",
    description: "Completion, hover, diagnostics, and formatting for JSON and JSON Schema, for every dialect."
  },
  {
    repo: "json-schema-coverage",
    ref: "main",
    topic: "tests",
    label: "JSON Schema Coverage",
    description: "Vitest matchers for schemas, and coverage reports for the keywords, branches, and subschemas your tests reach.",
    command: "npm install --save-dev @hyperjump/json-schema-coverage"
  },
  {
    repo: "browser",
    ref: "main",
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
    repo: "json-schema-errors",
    ref: "main",
    topic: "components",
    label: "JSON Schema Errors",
    summary: "Readable validation errors",
    description: "Human-friendly error messages from the standard output format, whichever validator produced it.",
    command: "npm install @hyperjump/json-schema-errors"
  },
  {
    repo: "json-schema-formats",
    ref: "main",
    topic: "components",
    label: "JSON Schema Formats",
    summary: "Format validators",
    description: "Validation functions for the JSON Schema format keyword.",
    command: "npm install @hyperjump/json-schema-formats"
  },
  {
    repo: "pact",
    ref: "main",
    topic: "components",
    label: "Pact",
    summary: "Iterator pipelines",
    description: "Higher order functions for iterators and async iterators, as steps in a pipeline, with the native Iterator helpers' names.",
    command: "npm install @hyperjump/pact"
  },
  {
    repo: "uri",
    ref: "main",
    topic: "components",
    label: "URI",
    summary: "RFC 3986 URIs and IRIs",
    description: "Validate, parse, and resolve URIs (RFC 3986) and IRIs (RFC 3987). Small and fast.",
    command: "npm install @hyperjump/uri"
  },
  {
    repo: "uri-template",
    ref: "main",
    topic: "components",
    label: "URI Template",
    summary: "RFC 6570 templates",
    description: "Parse and expand RFC 6570 URI Templates, up to Level 4, with detailed errors.",
    command: "npm install @hyperjump/uri-template"
  }
];

export const localRepos = process.env.LOCAL_REPOS;

export const repoUrl = (source) => `https://github.com/hyperjump-io/${source.repo}.git`;

export const repoDir = (source) => localRepos
  ? resolve(localRepos, source.repo)
  : resolve(".cache/repos", source.repo);

export const websiteDir = (source) => resolve(repoDir(source), "website");

// A repo whose branch has no website/ yet, or that isn't on GitHub yet, has
// a placeholder page that says its docs are coming soon.
export const hasDocs = (source) => existsSync(resolve(websiteDir(source), "README.md"));
