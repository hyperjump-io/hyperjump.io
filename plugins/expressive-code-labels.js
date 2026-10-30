// An Expressive Code plugin that titles each code block with what it is, so
// a schema and the JSON it describes, which look alike, read apart: "JSON
// Schema · 2020-12", or "JSON", "JavaScript", "Terminal", "Output". A block
// is a schema if it has `$schema`, or if its fence gives the dialect it's
// loaded with, like the highlighting plugin's. A block with a title of its
// own keeps it. The docs don't change, so they read the same on GitHub.
//
// A schema's title links to the page that says what its styling means.
import { h } from "@expressive-code/core/hast";

const legend = "/reading-schemas/";

const dialects = {
  "https://json-schema.org/v1": "v1",
  "https://json-schema.org/draft/2020-12/schema": "2020-12",
  "https://json-schema.org/draft/2019-09/schema": "2019-09",
  "http://json-schema.org/draft-07/schema": "draft-07",
  "http://json-schema.org/draft-06/schema": "draft-06",
  "http://json-schema.org/draft-04/schema": "draft-04"
};

const languages = {
  javascript: "JavaScript",
  js: "JavaScript",
  typescript: "TypeScript",
  ts: "TypeScript",
  jref: "JRef",
  bash: "Terminal",
  sh: "Terminal",
  shell: "Terminal",
  // The docs show what's printed in a `text` block
  text: "Output"
};

export default function pluginLabels() {
  const schemas = new WeakSet();
  return {
    name: "labels",
    hooks: {
      preprocessMetadata: ({ codeBlock }) => {
        if (!codeBlock.props.title) {
          const label = labelOf(codeBlock);
          if (label) {
            codeBlock.props.title = label;
          }
          if (label?.startsWith("JSON Schema")) {
            schemas.add(codeBlock);
          }
        }
      },
      // After the frame is rendered, with its title
      postprocessRenderedBlock: ({ codeBlock, renderData }) => {
        const title = schemas.has(codeBlock) && findTitle(renderData.blockAst);
        if (title) {
          title.children = [h("a", { href: legend, title: "What the styling means" }, title.children)];
        }
      }
    }
  };
}

function findTitle(node) {
  if (node.type === "element" && [].concat(node.properties?.className ?? []).includes("title")) {
    return node;
  }
  for (const child of node.children ?? []) {
    const title = findTitle(child);
    if (title) return title;
  }
}

function labelOf(codeBlock) {
  if (codeBlock.language === "json") {
    const dialectUri = codeBlock.metaOptions.getString("dialect")
      ?? /"\$schema"\s*:\s*"([^"]*)"/.exec(codeBlock.code)?.[1];
    if (dialectUri === undefined) {
      return "JSON";
    }
    const dialect = dialects[dialectUri.replace(/#$/, "")];
    return dialect ? `JSON Schema · ${dialect}` : "JSON Schema";
  }
  return languages[codeBlock.language];
}
