// Turns a paragraph that is only `*Added in vX.Y.Z*` (or Changed,
// Deprecated) or `*Coming soon*` into a badge. Anything close to that form
// that doesn't match is an error, so a typo doesn't render as plain italics.
import { defineMdastPlugin } from "satteri";

const marker = /^(?:(Added|Changed|Deprecated) in v\d+\.\d+\.\d+|Coming soon)$/;
const nearMiss = /^(added|changed|deprecated|coming)\b/i;

export default defineMdastPlugin({
  name: "version-markers",
  paragraph(node, ctx) {
    if (node.children.length !== 1 || node.children[0].type !== "emphasis") return;
    const text = ctx.textContent(node);
    if (marker.test(text)) {
      const kind = text === "Coming soon" ? "coming-soon" : text.split(" ")[0].toLowerCase();
      ctx.replaceNode(node, { type: "html", value: `<p class="version-marker version-marker-${kind}">${text}</p>` });
    } else if (nearMiss.test(text)) {
      throw Error(`${ctx.fileURL?.pathname ?? "unknown file"}: malformed version marker: *${text}*`);
    }
  }
});
