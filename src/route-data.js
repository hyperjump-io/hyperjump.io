import { defineRouteMiddleware } from "@astrojs/starlight/route-data";
import logo from "./assets/logo.svg?raw";

export const onRequest = defineRouteMiddleware(({ locals }) => {
  const { id, entry, pagination } = locals.starlightRoute;

  // Puts the logo in the landing page's hero inline, so CSS can color it.
  // Frontmatter can't import it, so it's added here. Only the landing page,
  // whose id is "", has it: the 404 page has a hero too, and the logo would
  // make it look like a second landing page.
  if (id === "") {
    entry.data.hero.image = { html: logo };
  }

  // The previous and next links stay in the page's package, the first
  // segment of its path, so they don't go from one package's last page to
  // the next package's first in a topic with several. A topic's front page
  // isn't a package's, so it has neither.
  const section = id.split("/")[0];
  for (const direction of ["prev", "next"]) {
    const link = pagination[direction];
    if (link && link.href.split("/")[1] !== section) {
      pagination[direction] = undefined;
    }
  }
});
