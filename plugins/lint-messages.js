// On a lint rule's page, the blockquote after a `json` example lists what
// the rule reports for it, one message per line. It's shown as the
// linter's output, not a quote: each message verbatim, in monospace, marked
// with its severity's icon, in the color of the example's underlines.
// Verbatim means from the page's source, since a blockquote's text would get
// typographic quotes, which the linter never prints.
import { fileURLToPath } from "node:url";
import { defineMdastPlugin } from "satteri";

const rulePage = /\/json-schema\/linting\/rules\/(?!index\.md$)[^/]+\.md$/;

// Starlight's built-in warning and error icons, the ones its caution and
// danger asides use. An icon, not a character like ⚠, since the code font
// doesn't have those, and each system draws them with a font of its own.
const icons = {
  warning: "<path d=\"M12 16a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm10.67 1.47-8.05-14a3 3 0 0 0-5.24 0l-8 14A3 3 0 0 0 3.94 22h16.12a3 3 0 0 0 2.61-4.53Zm-1.73 2a1 1 0 0 1-.88.51H3.94a1 1 0 0 1-.88-.51 1 1 0 0 1 0-1l8-14a1 1 0 0 1 1.78 0l8.05 14a1 1 0 0 1 .05 1.02v-.02ZM12 8a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V9a1 1 0 0 0-1-1Z\"/>",
  error: "<path d=\"M12 7a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V8a1 1 0 0 0-1-1Zm0 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm9.71-7.44-5.27-5.27a1.05 1.05 0 0 0-.71-.29H8.27a1.05 1.05 0 0 0-.71.29L2.29 7.56a1.05 1.05 0 0 0-.29.71v7.46c.004.265.107.518.29.71l5.27 5.27c.192.183.445.286.71.29h7.46a1.05 1.05 0 0 0 .71-.29l5.27-5.27a1.05 1.05 0 0 0 .29-.71V8.27a1.05 1.05 0 0 0-.29-.71ZM20 15.31 15.31 20H8.69L4 15.31V8.69L8.69 4h6.62L20 8.69v6.62Z\"/>"
};

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
      const icon = `<svg class="lint-severity" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor">${icons[severity]}</svg>`;
      const items = messages.map((message) => `<li>${icon}<span class="sr-only">${severity}: </span>${escapeHtml(message)}</li>`);
      ctx.replaceNode(node, { type: "html", value: `<ul class="lint-messages lint-messages-${severity}">${items.join("")}</ul>` });
    }
  });
}

function escapeHtml(text) {
  return text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}
