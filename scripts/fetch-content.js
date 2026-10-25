// Gets each repo, and copies its website/ into src/content/docs/<section>/.
// README.md becomes index.md, and the first H1 moves into frontmatter as the
// title, which Starlight requires. A repo with API pages gets its
// dependencies installed, for TypeDoc. With LOCAL_REPOS, the checkouts are
// used as they are.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { sources, sections, localRepos, repoUrl, repoDir, websiteDir, needsWholeRepo } from "../sources.js";

const out = "src/content/docs";

if (!localRepos) {
  for (const source of sources) {
    checkout(source);
  }
  for (const source of sources.filter(needsWholeRepo)) {
    // Not `npm ci`, since a dependency-only repo might not have a lockfile.
    run("npm", "install", "--ignore-scripts", "--no-audit", "--no-fund", "--prefix", repoDir(source));
  }
}

for (const source of sections) {
  const dir = websiteDir(source);
  if (!existsSync(dir)) {
    throw Error(`${source.repo}${localRepos ? "" : `@${source.ref}`} has no website/ directory`);
  }

  await rm(join(out, source.section), { recursive: true, force: true });
  for (const file of await readdir(dir, { recursive: true, withFileTypes: true })) {
    if (!file.isFile()) continue;
    const from = join(file.parentPath, file.name);
    const to = join(out, source.section, relative(dir, from).replace(/(^|\/)README\.md$/, "$1index.md"));
    await mkdir(dirname(to), { recursive: true });
    if (from.endsWith(".md")) {
      await writeFile(to, withTitle(await readFile(from, "utf8"), from));
    } else {
      await cp(from, to);
    }
  }
}

// A shallow clone, updated in place on later runs. It's sparse, with only
// website/, unless the whole repo is needed.
function checkout(source) {
  const dir = repoDir(source);
  if (!existsSync(dir)) {
    run("git", "clone", "--depth", "1", "--branch", source.ref, "--filter=blob:none", "--sparse", repoUrl(source), dir);
  } else {
    run("git", "-C", dir, "fetch", "--depth", "1", "origin", source.ref);
    run("git", "-C", dir, "checkout", "--detach", "FETCH_HEAD");
  }
  if (needsWholeRepo(source)) {
    run("git", "-C", dir, "sparse-checkout", "disable");
  } else {
    run("git", "-C", dir, "sparse-checkout", "set", "website");
  }
}

// The command's own error is clear enough, so a failure exits without a
// stack trace.
function run(command, ...args) {
  try {
    execFileSync(command, args, { stdio: ["ignore", "ignore", "inherit"] });
  } catch {
    process.exit(1);
  }
}

function withTitle(markdown, path) {
  const match = /^# (.+)\n+/m.exec(markdown);
  if (!match || markdown.slice(0, match.index).trim() !== "") {
    throw Error(`${path}: the page must start with an H1`);
  }
  const body = markdown.slice(match.index + match[0].length);
  // A title is plain text, so code in the heading (`ignored-ref-siblings`)
  // loses its backticks.
  const title = match[1].replaceAll("`", "");
  return `---\ntitle: ${JSON.stringify(title)}\n---\n\n${body}`;
}
