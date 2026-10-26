// An Expressive Code annotation that wraps the code it covers in a span with
// a class, for the site's CSS. It renders after syntax highlighting, so it
// wraps the highlighted tokens, and one that renders later wraps the others.
import { ExpressiveCodeAnnotation } from "@expressive-code/core";
import { h } from "@expressive-code/core/hast";

export class ClassAnnotation extends ExpressiveCodeAnnotation {
  constructor(className, renderPhase, properties, inlineRange) {
    super({ inlineRange, renderPhase });
    this.className = className;
    this.properties = properties;
  }

  render({ nodesToTransform }) {
    return nodesToTransform.map((node) => h("span", { ...this.properties, class: this.className }, node));
  }
}
