// On a lint rule's page, the blockquote after a `json` example lists what
// the rule reports for it, one message per line. It's shown as the
// linter's output, not a quote: each message verbatim, in monospace, marked
// with its severity's icon, in the color of the example's underlines.
// Verbatim means from the page's source, since a blockquote's text would get
// typographic quotes, which the linter never prints.
import { fileURLToPath } from "node:url";
import { defineMdastPlugin } from "satteri";
import { icons } from "./icons.js";

const rulePage = /\/json-schema\/linting\/rules\/(?!index\.md$)[^/]+\.md$/;

export default function lintMessages({ fileURL, source }) {
  if (!fileURL || !rulePage.test(fileURLToPath(fileURL))) return null;
  // A rule page says "In `recommended`, as a warning" (or "an error").
  const severity = /In `recommended`, as an error/.test(source) ? "error" : "warning";

  return defineMdastPlugin({
    name: "lint-messages",
    options: { position: true },
    blockquote(node, ctx) {
      const siblings = ctx.parent(node).children;
      const previous = siblings[ctx.indexOf(node) - 1];
      if (previous?.type !== "code" || previous.lang !== "json") return;

      const quote = source.slice(node.position.start.offset, node.position.end.offset);
      const messages = quote.split("\n").filter((line) => line.startsWith("> ")).map((line) => line.slice(2));
      const icon = `<svg class="lint-severity" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor"><path d="${icons[severity]}"/></svg>`;
      const items = messages.map((message) => `<li>${icon}<span class="sr-only">${severity}: </span>${escapeHtml(message)}</li>`);
      ctx.replaceNode(node, { type: "html", value: `<ul class="lint-messages lint-messages-${severity}">${items.join("")}</ul>` });
    }
  });
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
