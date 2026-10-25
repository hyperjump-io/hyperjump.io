// An Expressive Code plugin that highlights the keywords of a JSON Schema in
// a `json` code block, so they look different from property names that
// aren't keywords. A block is a schema if it has `$schema`, or if its fence
// gives the dialect it's loaded with, for a schema without `$schema`:
// ```json dialect=https://json-schema.org/draft/2020-12/schema```. It's resolved
// with @hyperjump/json-schema, so a keyword is whatever the schema's dialect
// says it is, wherever it is in the schema. Each property gets classes:
//
// - `json-schema-dialect` on the name of `$schema`, and
//   `json-schema-dialect-uri` on its value
// - `json-schema-identifier` on the name of a keyword that identifies a
//   schema (`$id`, `$anchor`, `$dynamicAnchor`, ...), and
//   `json-schema-identifier-value` on its value
// - `json-schema-comment` on all of `$comment`
// - `json-schema-reference` on the name of a `$ref` that replaces the schema
//   (draft-04 through draft-07), `json-schema-reference-uri` on its value, and
//   on the object it's in, which isn't a schema or plain JSON,
//   `json-schema-reference-object` on all of it and
//   `json-schema-reference-brace` on its braces
// - `json-schema-reference-uri` and `json-schema-reference-value` on the
//   value of a keyword that references a schema (`$ref`, `$dynamicRef`,
//   `$recursiveRef`)
// - `json-schema-keyword` on the name of any other keyword
// - `json-schema-ignored` on all of a property of a schema that has no
//   effect: one that isn't a keyword in its dialect, or a sibling of a `$ref`
//   that replaces the schema
// - `json-schema-extension` on the name of an `x-` keyword in v1, where it's
//   an annotation, not an unknown keyword
// - `json-schema-property` on the name of any other property, like a name in
//   `properties`
//
// A `javascript` or `js` block is highlighted too, in each object literal
// with `$schema` (see javascript-schemas.js).
//
// The name of a core keyword (`$schema`, `$id`, `$ref`, `$defs`, ... the core
// vocabulary of 2019-09 and 2020-12, and the same keywords in other dialects)
// also gets `json-schema-core`.
//
// On a lint rule's page, the block is linted with that rule, and what each
// message is about gets `json-schema-lint-warn` or `json-schema-lint-error`,
// by the rule's severity in `recommended`, which the page says, with the
// message as its title. If the messages aren't the ones the page lists after
// the block, it's an error, so the page and the rule don't drift apart.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ExpressiveCodeAnnotation, PluginStyleSettings, setAlpha } from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";
import { javascriptSchemas } from "./javascript-schemas.js";
import { sources, repoDir } from "../sources.js";

const unknownKeyword = "https://json-schema.org/keyword/unknown#";
const dialectKeyword = "https://json-schema.org/keyword/schema";
const commentKeyword = "https://json-schema.org/keyword/comment";
const v1Dialect = "https://json-schema.org/v1";
const coreKeyword = /^https:\/\/json-schema\.org\/keyword\/(?:draft-[^/]+\/)?(?:schema|vocabulary|id|anchor|dynamicAnchor|recursiveAnchor|ref|dynamicRef|recursiveRef|definitions|comment)$/;
const referenceKeyword = /^https:\/\/json-schema\.org\/keyword\/(?:draft-[^/]+\/)?(?:ref|dynamicRef|recursiveRef)$/;
const identifierKeyword = /^https:\/\/json-schema\.org\/keyword\/(?:draft-[^/]+\/)?(?:id|anchor|dynamicAnchor|recursiveAnchor)$/;

export default function pluginJsonSchema() {
  return {
    name: "json-schema",
    // Colors from each code theme, so any theme works: its color for
    // comments, for what's styled like one, and a tint of its color for
    // strings, for a reference, since it is one. CSS gets them as
    // `--ec-jsonSchema-*`.
    styleSettings: new PluginStyleSettings({
      defaultValues: {
        jsonSchema: {
          comment: ({ theme }) => tokenColor(theme, "comment"),
          referenceTint: ({ theme }) => setAlpha(tokenColor(theme, "string"), theme.type === "dark" ? 0.18 : 0.12)
        }
      }
    }),
    hooks: {
      postprocessAnalyzedCode: async ({ codeBlock }) => {
        if (codeBlock.language === "json") {
          await highlightJson(codeBlock);
        } else if (["javascript", "js"].includes(codeBlock.language) && codeBlock.code.includes("$schema")) {
          await highlightJavaScript(codeBlock);
        }
      }
    }
  };
}

async function highlightJson(codeBlock) {
  const dialectUri = codeBlock.metaOptions.getString("dialect");
  if (!dialectUri && !codeBlock.code.includes("\"$schema\"")) {
    return;
  }
  const page = codeBlock.parentDocument?.sourceFilePath;
  const rule = page && lintRule(page);
  const resolved = await resolve(codeBlock.code, dialectUri, rule);
  if (!resolved) {
    return;
  }
  highlight(codeBlock, resolved.tree, (position) => position);
  if (rule) {
    underlineLintMessages(codeBlock, page, rule, resolved.messages);
  }
}

// Each schema is resolved as JSON, and what's marked in the JSON is marked
// where it came from in the code.
async function highlightJavaScript(codeBlock) {
  const { code } = codeBlock;
  for (const { json, sourceRange } of javascriptSchemas(code)) {
    const resolved = await resolve(json);
    if (!resolved) {
      continue;
    }
    highlight(codeBlock, resolved.tree, (position) => {
      const range = sourceRange(position.start.offset, position.end.offset);
      return range && { start: point(code, range[0]), end: point(code, range[1]) };
    });
  }
}

// Marks a schema AST's nodes in a code block, where `toBlock` says they are
function highlight(codeBlock, schema, toBlock) {
  for (const [node, className] of marks(schema)) {
    const position = toBlock(node.position);
    if (position) {
      annotate(codeBlock, position, className);
    }
  }
  for (const reference of referenceObjects(schema)) {
    const position = toBlock(reference.position);
    if (position) {
      const { start, end } = position;
      // It wraps everything else in the object, so it renders last.
      annotate(codeBlock, position, "json-schema-reference-object", "later");
      annotate(codeBlock, { start, end: { ...start, column: start.column + 1 } }, "json-schema-reference-brace");
      annotate(codeBlock, { start: { ...end, column: end.column - 1 }, end }, "json-schema-reference-brace");
    }
  }
}

// The line and column (both from 1) of an offset in code
function point(code, offset) {
  const before = code.slice(0, offset);
  const line = before.split("\n").length;
  return { line, column: offset - before.lastIndexOf("\n") };
}

// A theme's color for a scope, like `string`: its last rule for it, since
// later rules win
function tokenColor(theme, scope) {
  const rule = theme.settings.findLast((setting) => [].concat(setting.scope ?? []).includes(scope));
  return rule?.settings?.foreground ?? theme.colors["editor.foreground"];
}

// The rule a page is about, from its path: `json-schema/linting/rules/<rule>.md`
function lintRule(page) {
  return /\/json-schema\/linting\/rules\/(?!index\.md$)([^/]+)\.md$/.exec(page)?.[1];
}

// Underlines what each of the rule's messages is about, and throws if they
// aren't the messages the page lists after the block.
function underlineLintMessages(codeBlock, page, rule, messages) {
  const severity = pageSeverity(page);
  for (const message of messages) {
    const position = message.place?.start ? message.place : undefined;
    if (position) {
      annotate(codeBlock, position, `json-schema-lint-${severity}`, "latest", { title: message.reason });
    }
  }

  const actual = messages.map((message) => message.reason).sort();
  const expected = pageMessages(page, codeBlock.code).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) {
    throw Error(`'${rule}' doesn't report what its page says for an example.
  The page: ${JSON.stringify(expected)}
  The rule: ${JSON.stringify(actual)}`);
  }
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const pageSources = new Map();
function pageSource(page) {
  if (!pageSources.has(page)) {
    pageSources.set(page, readFileSync(page, "utf8"));
  }
  return pageSources.get(page);
}

// A rule page says "In `recommended`, as a warning" (or "an error").
function pageSeverity(page) {
  return /In `recommended`, as an error/.test(pageSource(page)) ? "error" : "warn";
}

// The messages a page lists in the blockquote after a block, one per line.
// The block's fence can have options after `json`.
function pageMessages(page, code) {
  const source = pageSource(page);
  const block = new RegExp(`^\`\`\`json[^\\n]*\\n${escapeRegExp(code)}\\n\`\`\`\\n`, "m").exec(source);
  if (!block) {
    return [];
  }
  const after = source.slice(block.index + block[0].length);
  const quote = /^\n*((?:> .*\n?|>\n?)+)/.exec(after)?.[1] ?? "";
  return quote.split("\n").filter((line) => line.startsWith("> ")).map((line) => line.slice(2));
}

// A node can span lines, so each line it's on gets its own annotation,
// without the line's indentation.
function annotate(codeBlock, { start, end }, className, renderPhase = "earlier", properties = {}) {
  for (let line = start.line; line <= end.line; line++) {
    const code = codeBlock.getLine(line - 1);
    const indentation = code.text.length - code.text.trimStart().length;
    code.addAnnotation(new ClassAnnotation(className, renderPhase, properties, {
      columnStart: line === start.line ? start.column - 1 : indentation,
      columnEnd: line === end.line ? end.column - 1 : code.text.length
    }));
  }
}

// Wraps the code it covers in a span with a class, for the site's CSS. It
// renders after syntax highlighting, so it wraps the highlighted tokens, and
// one that renders later wraps the others.
class ClassAnnotation extends ExpressiveCodeAnnotation {
  constructor(className, renderPhase, properties, inlineRange) {
    super({ inlineRange, renderPhase });
    this.className = className;
    this.properties = properties;
  }

  // Each token is wrapped separately, so the first and last of a line's are
  // marked, for CSS that styles the ends, like rounded corners.
  render({ nodesToTransform }) {
    const last = nodesToTransform.length - 1;
    return nodesToTransform.map((node, index) => {
      const ends = [index === 0 && "json-schema-start", index === last && "json-schema-end"].filter(Boolean);
      return h("span", { ...this.properties, class: [this.className, ...ends] }, node);
    });
  }
}

// The schema AST of a code block, and the messages of a lint rule, if one is
// given, or undefined if it can't be resolved. A dialect, if one is given, is
// the one the schema is loaded with, for a schema without `$schema`. It can't
// retrieve anything, so a `$schema` that isn't a built-in dialect has no
// keywords.
async function resolve(code, dialectUri, rule) {
  const { jsonSchema, jsonSchemaResolve, rejsonParse, unified, VFile, lintRules } = await library();
  const processor = unified()
    .use(rejsonParse, { accept: "recovered" })
    .use(jsonSchemaResolve, {
      session: jsonSchema.session({ allowRetrieval: [] }),
      // Each block has a session of its own, so they can share a URI. It's in
      // some lint messages.
      uri: "https://example.com/schema.json",
      ...dialectUri && { dialectUri }
    });
  if (rule) {
    processor.use(await lintRules(rule));
  }
  const file = new VFile(code);
  try {
    const tree = await processor.run(processor.parse(file), file);
    return { tree, messages: file.messages.filter((message) => message.ruleId === rule) };
  } catch {
    return undefined;
  }
}

// Each node to mark, with its class
function* marks(node, parent) {
  if (node.type === "json-property") {
    yield* propertyMarks(node, parent);
  }
  for (const child of node.children ?? []) {
    yield* marks(child, node);
  }
}

// The objects a `$ref` replaces (draft-04 through draft-07)
function* referenceObjects(node) {
  if (node.type === "reference") {
    yield node;
  }
  for (const child of node.children ?? []) {
    yield* referenceObjects(child);
  }
}

function* propertyMarks(property, object) {
  const [name, value] = property.children;
  const keywordUri = property.keywordUri ?? "";
  if (coreKeyword.test(keywordUri)) {
    yield [name, "json-schema-core"];
  }
  if (keywordUri === dialectKeyword) {
    yield [name, "json-schema-dialect"];
    yield [value, "json-schema-dialect-uri"];
  } else if (keywordUri === commentKeyword) {
    yield [property, "json-schema-comment"];
  } else if (identifierKeyword.test(keywordUri)) {
    yield [name, "json-schema-identifier"];
    yield [value, "json-schema-identifier-value"];
  } else if (keywordUri.startsWith(unknownKeyword)) {
    if (object.dialectUri === v1Dialect && name.value.startsWith("x-")) {
      yield [name, "json-schema-extension"];
    } else {
      yield [property, "json-schema-ignored"];
    }
  } else if (referenceKeyword.test(keywordUri)) {
    yield [name, "json-schema-keyword"];
    yield [value, "json-schema-reference-uri"];
    yield [value, "json-schema-reference-value"];
  } else if (keywordUri) {
    yield [name, "json-schema-keyword"];
  } else if (object.type === "reference" && name.value === "$ref") {
    yield [name, "json-schema-core"];
    yield [name, "json-schema-reference"];
    yield [value, "json-schema-reference-uri"];
  } else if (object.type === "reference") {
    yield [property, "json-schema-ignored"];
  } else {
    yield [name, "json-schema-property"];
  }
}

// @hyperjump/json-schema v2 isn't published, so it's loaded from the repo the
// site is built from, with every dialect. unified and browser's JSON parser
// come from the same place, so they're the copies it uses.
let loading;
function library() {
  loading ??= (async () => {
    const dir = repoDir(sources.find(({ repo }) => repo === "json-schema"));
    const { JsonSchema, jsonSchemaResolve } = await importExport(dir, ".");
    const jsonSchema = new JsonSchema();
    const dialects = {
      "./v1": "addV1",
      "./draft-04": "addDraft04",
      "./draft-06": "addDraft06",
      "./draft-07": "addDraft07",
      "./draft-2019-09": "addDraft201909",
      "./draft-2020-12": "addDraft202012"
    };
    for (const [subpath, add] of Object.entries(dialects)) {
      (await importExport(dir, subpath))[add](jsonSchema);
    }
    const { unified } = await importExport(join(dir, "node_modules/unified"), ".");
    const { VFile } = await importExport(join(dir, "node_modules/vfile"), ".");
    const { rejsonParse } = await importExport(join(dir, "node_modules/@hyperjump/browser"), "./json");
    const lintRules = async (rule) => (await importExport(dir, `./lint/rules/${rule}`)).default;
    return { jsonSchema, jsonSchemaResolve, rejsonParse, unified, VFile, lintRules };
  })();
  return loading;
}

// Node's own import. The config is loaded by Vite, which rewrites `import()`
// to its module runner, and that's closed by the time code blocks render.
const nativeImport = new Function("specifier", "return import(specifier)");

// Imports a package's export from its directory, following its `exports`,
// including a pattern like `./lint/rules/*`.
async function importExport(dir, subpath) {
  const { exports } = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  let target;
  if (typeof exports === "string") {
    target = subpath === "." ? exports : undefined;
  } else if (subpath in exports) {
    target = exports[subpath];
  } else {
    for (const [pattern, patternTarget] of Object.entries(exports)) {
      const [prefix, suffix] = pattern.split("*");
      if (suffix !== undefined && subpath.startsWith(prefix) && subpath.endsWith(suffix)) {
        const match = subpath.slice(prefix.length, subpath.length - suffix.length);
        target = JSON.parse(JSON.stringify(patternTarget).replaceAll("*", match));
        break;
      }
    }
  }
  if (typeof target === "object") {
    target = target.import ?? target.default;
  }
  return nativeImport(pathToFileURL(join(dir, target)).href);
}
