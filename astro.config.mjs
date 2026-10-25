import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import siteLinks from "./plugins/site-links.js";
import versionMarkers from "./plugins/version-markers.js";
import { sidebar } from "./sidebar.js";

export default defineConfig({
  site: "https://hyperjump.io",
  markdown: {
    processor: satteri({ mdastPlugins: [siteLinks, versionMarkers] })
  },
  integrations: [
    starlight({
      title: "Hyperjump",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/hyperjump-io" }],
      sidebar,
      customCss: ["./src/styles/custom.css"],
      plugins: [starlightLinksValidator()]
    })
  ]
});
