import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";
import siteLinks from "./plugins/site-links.js";
import versionMarkers from "./plugins/version-markers.js";
import { apis } from "./api.js";
import { topics, topicPages } from "./sidebar.js";

export default defineConfig({
  site: "https://hyperjump.io",
  markdown: {
    processor: satteri({ mdastPlugins: [siteLinks, versionMarkers] })
  },
  integrations: [
    starlight({
      title: "Hyperjump",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/hyperjump-io" }],
      customCss: ["./src/styles/custom.css"],
      plugins: [
        // The landing page is the only page that isn't a package's.
        starlightSidebarTopics(topics, { topics: topicPages, exclude: ["/"] }),
        // After the topics, which make the sidebar the API groups go in.
        ...apis.map((api) => api.plugin),
        starlightLinksValidator()
      ]
    })
  ]
});
