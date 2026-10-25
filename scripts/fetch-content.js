// Gets each repo's website/ and copies it into src/content/docs/<section>/.
// README.md becomes index.md, and the first H1 moves into frontmatter as the
// title, which Starlight requires.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { sources, localRepos, repoUrl, repoDir, websiteDir } from "../sources.js";

const out = "src/content/docs";

for (const source of sources) {
  if (!localRepos) checkout(source);
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

// A shallow, sparse clone of website/ only, updated in place on later runs.
function checkout(source) {
  const dir = repoDir(source);
  if (existsSync(dir)) {
    git("-C", dir, "fetch", "--depth", "1", "origin", source.ref);
    git("-C", dir, "checkout", "--detach", "FETCH_HEAD");
  } else {
    git("clone", "--depth", "1", "--branch", source.ref, "--filter=blob:none", "--sparse", repoUrl(source), dir);
    git("-C", dir, "sparse-checkout", "set", "website");
  }
}

// Git's own error is clear enough, so a failure exits without a stack trace.
function git(...args) {
  try {
    execFileSync("git", args, { stdio: ["ignore", "ignore", "inherit"] });
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
  return `---\ntitle: ${JSON.stringify(match[1])}\n---\n\n${body}`;
}
