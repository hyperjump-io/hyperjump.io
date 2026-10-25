// Puts the logo in the landing page's hero inline, so CSS can color it.
// Frontmatter can't import it, so it's added here.
import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import logo from "./assets/logo.svg?raw";

export const onRequest = defineRouteMiddleware(({ locals }) => {
  const { hero } = locals.starlightRoute.entry.data;
  if (hero) {
    hero.image = { html: logo };
  }
});
