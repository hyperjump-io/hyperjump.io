import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";
import siteLinks from "./plugins/site-links.js";
import versionMarkers from "./plugins/version-markers.js";
import pluginJsonSchema from "./plugins/expressive-code-json-schema.js";
import { topics, topicPages } from "./sidebar.js";
import { redirects } from "./redirects.js";

export default defineConfig({
  site: "https://hyperjump.io",
  redirects,
  markdown: {
    processor: satteri({ mdastPlugins: [siteLinks, versionMarkers] })
  },
  integrations: [
    starlight({
      title: "Hyperjump",
      components: { SiteTitle: "./src/components/SiteTitle.astro" },
      routeMiddleware: "./src/route-data.js",
      expressiveCode: {
        plugins: [pluginJsonSchema()],
        // Stock themes, so any could be swapped in without restyling
        themes: ["kanagawa-dragon", "ayu-light"],
        // What a program prints, like messages and reporter output, can't
        // be reformatted for a narrow code block the way code can, so it
        // wraps instead of scrolling
        defaultProps: {
          overridesByLang: {
            "text,plaintext,txt": { wrap: true, hangingIndent: 4 }
          }
        }
      },
      favicon: "/favicon.svg",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/hyperjump-io" }],
      customCss: [
        "@fontsource/ibm-plex-sans/400.css",
        "@fontsource/ibm-plex-sans/600.css",
        "@fontsource/ibm-plex-mono/400.css",
        "./src/styles/custom.css"
      ],
      plugins: [
        // The landing page and the 404 page aren't a package's.
        starlightSidebarTopics(topics, { topics: topicPages, exclude: ["/", "/404"] }),
        starlightLinksValidator()
      ]
    })
  ]
});
