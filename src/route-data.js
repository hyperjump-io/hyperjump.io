// Puts the logo in the landing page's hero inline, so CSS can color it.
// Frontmatter can't import it, so it's added here. Only the landing page,
// whose id is "", has it: the 404 page has a hero too, and the logo would
// make it look like a second landing page.
import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import logo from "./assets/logo.svg?raw";

export const onRequest = defineRouteMiddleware(({ locals }) => {
  const { id, entry } = locals.starlightRoute;
  if (id === "") {
    entry.data.hero.image = { html: logo };
  }
});
