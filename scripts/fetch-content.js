// Gets each repo, and copies its website/ into src/content/docs/<repo>/.
// README.md becomes index.md, and the first H1 moves into frontmatter as the
// title, which Starlight requires. The frontmatter also gets the page's edit
// link, to its file on GitHub, since it's in another repo. With LOCAL_REPOS, the checkouts are used
// as they are. A repo without website/ yet, on its branch or because the
// repo or branch isn't on GitHub yet, gets a placeholder front page. Pages
// of a repo that's no longer in sources.js are removed.
import { execFileSync, spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, dirname, relative } from "node:path";
import { sources, localRepos, repoUrl, repoDir, websiteDir, hasDocs } from "../sources.js";

const out = "src/content/docs";
// In each repo's directory, so a directory left by a repo that's been taken
// out of sources.js can be told apart from this repo's pages, like
// components/, and removed. Starlight only reads .md and .mdx files.
const marker = ".fetched";

// Repos GitHub doesn't show without signing in: private, or not created yet.
// Their placeholders don't link to them.
const hidden = new Set();

if (!localRepos) {
  for (const source of sources) {
    checkout(source);
  }
}

// Astro caches each page's rendered HTML, and reuses it while the page's
// markdown is the same, even when what renders it (plugins, code themes) has
// changed. `--force` doesn't clear the cache the dev server uses, so both
// caches are cleared here, before every start and build.
await rm(".astro/data-store.json", { force: true });
await rm("node_modules/.astro/data-store.json", { force: true });

for (const entry of await readdir(out, { withFileTypes: true })) {
  const dir = join(out, entry.name);
  if (entry.isDirectory() && existsSync(join(dir, marker)) && !sources.some(({ repo }) => repo === entry.name)) {
    console.warn(`${entry.name} isn't in sources.js, so its pages are removed`);
    await rm(dir, { recursive: true });
  }
}

for (const source of sources) {
  await rm(join(out, source.repo), { recursive: true, force: true });
  await mkdir(join(out, source.repo), { recursive: true });
  await writeFile(join(out, source.repo, marker), "");

  if (!hasDocs(source)) {
    console.warn(`${source.repo}${localRepos ? "" : `@${source.ref}`} has no website/, so it has a placeholder`);
    await writeFile(join(out, source.repo, "index.md"), placeholder(source));
    continue;
  }

  const dir = websiteDir(source);
  for (const file of await readdir(dir, { recursive: true, withFileTypes: true })) {
    if (!file.isFile()) continue;
    const from = join(file.parentPath, file.name);
    const to = join(out, source.repo, relative(dir, from).replace(/(^|\/)README\.md$/, "$1index.md"));
    await mkdir(dirname(to), { recursive: true });
    if (from.endsWith(".md")) {
      const editUrl = `https://github.com/hyperjump-io/${source.repo}/edit/${source.ref}/website/${relative(dir, from)}`;
      await writeFile(to, withFrontmatter(await readFile(from, "utf8"), from, editUrl));
    } else {
      await cp(from, to);
    }
  }
}

// A shallow, sparse clone of website/, updated in place on later runs. A
// repo or branch that isn't on GitHub has no clone, and so no website/.
function checkout(source) {
  const dir = repoDir(source);
  const found = spawnSync("git", ["ls-remote", "--exit-code", "--heads", repoUrl(source), source.ref], {
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
    encoding: "utf8"
  });
  // 2 is a repo without the branch. A repo that needs signing in to see is
  // private or doesn't exist. Anything else, like no network, is an error,
  // so a deploy doesn't replace every package's docs with a placeholder.
  const hiddenRepo = /could not read Username|Repository not found/.test(found.stderr);
  if (found.status === 2 || hiddenRepo) {
    if (hiddenRepo) hidden.add(source.repo);
    rmSync(dir, { recursive: true, force: true });
    return;
  }
  if (found.status !== 0) {
    process.stderr.write(found.stderr);
    process.exit(1);
  }
  if (!existsSync(dir)) {
    run("git", "clone", "--depth", "1", "--branch", source.ref, "--filter=blob:none", "--sparse", repoUrl(source), dir);
  } else {
    run("git", "-C", dir, "fetch", "--depth", "1", "origin", source.ref);
    run("git", "-C", dir, "checkout", "--detach", "FETCH_HEAD");
  }
  run("git", "-C", dir, "sparse-checkout", "set", "website");
  // Before its docs, the branch may be an older major version, which
  // the build doesn't run.
  if (source.install && hasDocs(source)) {
    run("git", "-C", dir, "sparse-checkout", "disable");
    run("npm", "ci", "--prefix", dir, "--omit=dev", "--ignore-scripts", "--no-audit", "--no-fund");
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

function withFrontmatter(markdown, path, editUrl) {
  const match = /^# (.+)\n+/m.exec(markdown);
  if (!match || markdown.slice(0, match.index).trim() !== "") {
    throw Error(`${path}: the page must start with an H1`);
  }
  const body = markdown.slice(match.index + match[0].length);
  // A title is plain text, so code in the heading (`ignored-ref-siblings`)
  // loses its backticks.
  const title = match[1].replaceAll("`", "");
  return `---\ntitle: ${JSON.stringify(title)}\neditUrl: ${JSON.stringify(editUrl)}\n---\n\n${body}`;
}

// The package's front page until its docs are on its branch: what its card
// on the landing page says, and where it is on GitHub. A released package's
// README there is its docs until then.
function placeholder(source) {
  const url = `https://github.com/hyperjump-io/${source.repo}`;
  const command = source.command && !source.unreleased ? `\`\`\`sh\n${source.command}\n\`\`\`\n\n` : "";
  const docs = source.unreleased
    ? `Docs are coming soon.${hidden.has(source.repo) ? "" : ` Until then, see [${source.repo} on GitHub](${url}).`}`
    : `Its docs aren't on this site yet. See [its README on GitHub](${url}#readme).`;
  return `---\ntitle: ${JSON.stringify(source.label)}\n---\n\n${source.description}\n\n${command}${docs}\n`;
}
