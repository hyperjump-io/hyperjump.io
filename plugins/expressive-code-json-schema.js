// An Expressive Code plugin that highlights the keywords of a JSON Schema in
// a `json` code block, so they look different from property names that
// aren't keywords. A block is a schema if it has `$schema`. It's resolved
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
// The name of a core keyword (`$schema`, `$id`, `$ref`, `$defs`, ... the core
// vocabulary of 2019-09 and 2020-12, and the same keywords in other dialects)
// also gets `json-schema-core`.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ExpressiveCodeAnnotation } from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";
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
    hooks: {
      postprocessAnalyzedCode: async ({ codeBlock }) => {
        if (codeBlock.language !== "json" || !codeBlock.code.includes("\"$schema\"")) {
          return;
        }
        const schema = await resolve(codeBlock.code);
        if (!schema) {
          return;
        }
        for (const [node, className] of marks(schema)) {
          annotate(codeBlock, node.position, className);
        }
        for (const reference of referenceObjects(schema)) {
          const { start, end } = reference.position;
          // It wraps everything else in the object, so it renders last.
          annotate(codeBlock, reference.position, "json-schema-reference-object", "later");
          annotate(codeBlock, { start, end: { ...start, column: start.column + 1 } }, "json-schema-reference-brace");
          annotate(codeBlock, { start: { ...end, column: end.column - 1 }, end }, "json-schema-reference-brace");
        }
      }
    }
  };
}

// A node can span lines, so each line it's on gets its own annotation,
// without the line's indentation.
function annotate(codeBlock, { start, end }, className, renderPhase = "earlier") {
  for (let line = start.line; line <= end.line; line++) {
    const code = codeBlock.getLine(line - 1);
    const indentation = code.text.length - code.text.trimStart().length;
    code.addAnnotation(new ClassAnnotation(className, renderPhase, {
      columnStart: line === start.line ? start.column - 1 : indentation,
      columnEnd: line === end.line ? end.column - 1 : code.text.length
    }));
  }
}

// Wraps the code it covers in a span with a class, for the site's CSS. It
// renders after syntax highlighting, so it wraps the highlighted tokens, and
// one that renders later wraps the others.
class ClassAnnotation extends ExpressiveCodeAnnotation {
  constructor(className, renderPhase, inlineRange) {
    super({ inlineRange, renderPhase });
    this.className = className;
  }

  render({ nodesToTransform }) {
    return nodesToTransform.map((node) => h("span", { class: this.className }, node));
  }
}

let examples = 0;

// The schema AST of a code block, or undefined if it can't be resolved. It
// can't retrieve anything, so a `$schema` that isn't a built-in dialect has
// no keywords.
async function resolve(code) {
  const { jsonSchema, jsonSchemaResolve, rejsonParse, unified } = await library();
  const processor = unified()
    .use(rejsonParse, { accept: "recovered" })
    .use(jsonSchemaResolve, {
      session: jsonSchema.session({ allowRetrieval: [] }),
      uri: `https://hyperjump.io/examples/${++examples}.schema.json`
    });
  try {
    return await processor.run(processor.parse(code));
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
    const { rejsonParse } = await importExport(join(dir, "node_modules/@hyperjump/browser"), "./json");
    return { jsonSchema, jsonSchemaResolve, rejsonParse, unified };
  })();
  return loading;
}

// Node's own import. The config is loaded by Vite, which rewrites `import()`
// to its module runner, and that's closed by the time code blocks render.
const nativeImport = new Function("specifier", "return import(specifier)");

// Imports a package's export from its directory, following its `exports`.
async function importExport(dir, subpath) {
  const { exports } = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
  let target = typeof exports === "string" && subpath === "." ? exports : exports[subpath];
  if (typeof target === "object") {
    target = target.import ?? target.default;
  }
  return nativeImport(pathToFileURL(join(dir, target)).href);
}
