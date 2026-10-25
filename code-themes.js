// The code themes: GitHub's, with JSON property names in the site's forest
// green. GitHub colors property names like strings, so they get a rule of
// their own. GitHub's light theme also gets a gray background, so a block
// stands apart from the white page, and strings in a medium blue, since its
// own are so dark they read as black.
import githubDark from "@shikijs/themes/github-dark";
import githubLight from "@shikijs/themes/github-light";

export const githubForestDark = withRules(githubDark, "github-forest-dark", {}, [
  { scope: ["support.type.property-name.json"], settings: { foreground: "#5bb37a" } }
]);

export const githubForestLight = withRules(githubLight, "github-forest-light", { "editor.background": "#f6f8fa" }, [
  { scope: ["string", "punctuation.definition.string"], settings: { foreground: "#0550ae" } },
  { scope: ["support.type.property-name.json"], settings: { foreground: "#2f6f45" } }
]);

// Later rules win, so these go after the theme's own.
function withRules(theme, name, colors, tokenColors) {
  return {
    ...theme,
    name,
    colors: { ...theme.colors, ...colors },
    tokenColors: [...theme.tokenColors, ...tokenColors]
  };
}
