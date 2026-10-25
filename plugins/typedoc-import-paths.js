// A TypeDoc plugin that names each module by its import path, from the
// package.json exports, instead of by its file's path.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { Converter, ReflectionKind } from "typedoc";
import { MemberRouter } from "typedoc-plugin-markdown";

/** @param {import("typedoc").Application} app */
export function load(app) {
  let pkg;
  app.converter.on(Converter.EVENT_RESOLVE_BEGIN, (context) => {
    const root = dirname(app.options.getValue("tsconfig"));
    pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
    const names = importPaths(pkg);
    for (const module of context.project.getReflectionsByKind(ReflectionKind.Module)) {
      const name = names(module.name);
      if (name) module.name = name;
    }
  });

  app.renderer.defineRouter("import-paths", class extends MemberRouter {
    getIdealBaseName(reflection) {
      // The section is the package, so its name isn't repeated in the path.
      const path = super.getIdealBaseName(reflection);
      return path.startsWith(`${pkg.name}/`) ? path.slice(pkg.name.length + 1) : path;
    }
  });
}

// TypeDoc names a module by its file's path from the entry points' common
// directory, without `.d.ts` or `/index.d.ts`.
function importPaths(pkg) {
  const patterns = Object.entries(pkg.exports).map(([subpath, { types }]) => {
    const file = types.replace(/^\.\/src\//, "").replace(/(\/index)?\.d\.ts$/, "");
    const pattern = new RegExp(`^${file.replaceAll("*", "(.+)")}$`);
    return [pattern, `${pkg.name}${subpath.slice(1)}`];
  });
  return (name) => {
    for (const [pattern, importPath] of patterns) {
      const match = pattern.exec(name);
      if (match) return importPath.replace("*", match[1]);
    }
  };
}
