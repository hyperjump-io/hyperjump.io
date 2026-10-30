// Finds the schemas in JavaScript code: the outermost object literals with a
// `$schema` property. Each is converted to JSON text, for the resolver, with
// a way back from each value's, property's, and property name's range in the
// JSON to its range in the JavaScript, so what's found in the JSON can be
// marked in the code. A value that isn't a literal, like a variable, is
// `null` in the JSON. A schema nested in one that's found is the resolver's
// to find, as an embedded resource.
//
// TypeScript is JavaScript once its types are stripped. Node replaces them
// with spaces, so every range is the same in both.
import { stripTypeScriptTypes } from "node:module";
import { parse } from "acorn";

export function javascriptSchemas(code, { typescript = false } = {}) {
  let program;
  try {
    const javascript = typescript ? stripTypeScriptTypes(code) : code;
    program = parse(javascript, { ecmaVersion: "latest", sourceType: "module" });
  } catch {
    return [];
  }
  const schemas = [];
  const visit = (node) => {
    if (node.type === "ObjectExpression" && node.properties.some((property) => propertyName(property) === "$schema")) {
      schemas.push(toJson(node));
      return;
    }
    for (const child of Object.values(node).flat()) {
      if (typeof child?.type === "string") {
        visit(child);
      }
    }
  };
  visit(program);
  return schemas;
}

function toJson(object) {
  let json = "";
  const ranges = new Map();
  const write = (node) => {
    const start = json.length;
    if (node?.type === "ObjectExpression") {
      json += "{";
      for (const property of node.properties) {
        const name = propertyName(property);
        if (name === undefined) {
          continue;
        }
        if (!json.endsWith("{")) {
          json += ",";
        }
        const propertyStart = json.length;
        json += JSON.stringify(name);
        ranges.set(`${propertyStart}:${json.length}`, [property.key.start, property.key.end]);
        json += ":";
        write(property.value);
        ranges.set(`${propertyStart}:${json.length}`, [property.start, property.end]);
      }
      json += "}";
    } else if (node?.type === "ArrayExpression") {
      json += "[";
      node.elements.forEach((element, index) => {
        json += index === 0 ? "" : ",";
        write(element?.type === "SpreadElement" ? undefined : element);
      });
      json += "]";
    } else {
      json += literal(node);
    }
    if (node) {
      ranges.set(`${start}:${json.length}`, [node.start, node.end]);
    }
  };
  write(object);
  return { json, sourceRange: (start, end) => ranges.get(`${start}:${end}`) };
}

// A property's name, if it's one a JSON object could have
function propertyName(property) {
  if (property.type !== "Property" || property.computed) {
    return undefined;
  } else if (property.key.type === "Identifier") {
    return property.key.name;
  } else if (property.key.type === "Literal") {
    return String(property.key.value);
  }
}

// A JSON literal, or `null` for what isn't one
function literal(node) {
  if (node?.type === "Literal" && ["string", "number", "boolean"].includes(typeof node.value)) {
    return JSON.stringify(node.value);
  } else if (node?.type === "TemplateLiteral" && node.expressions.length === 0) {
    return JSON.stringify(node.quasis[0].value.cooked);
  } else if (node?.type === "UnaryExpression" && node.operator === "-" && typeof node.argument.value === "number") {
    return JSON.stringify(-node.argument.value);
  } else {
    return "null";
  }
}
