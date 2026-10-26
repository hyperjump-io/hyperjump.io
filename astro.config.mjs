import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import starlight from "@astrojs/starlight";
import starlightLinksValidator from "starlight-links-validator";
import starlightSidebarTopics from "starlight-sidebar-topics";
import siteLinks from "./plugins/site-links.js";
import versionMarkers from "./plugins/version-markers.js";
import lintMessages from "./plugins/lint-messages.js";
import pluginJsonSchema from "./plugins/expressive-code-json-schema.js";
import pluginReporter from "./plugins/expressive-code-reporter.js";
import pluginLabels from "./plugins/expressive-code-labels.js";
import { topics, topicPages } from "./sidebar.js";
import { redirects } from "./redirects.js";

export default defineConfig({
  site: "https://hyperjump.io",
  redirects,
  markdown: {
    processor: satteri({ mdastPlugins: [siteLinks, versionMarkers, lintMessages] })
  },
  integrations: [
    starlight({
      title: "Hyperjump",
      components: { SiteTitle: "./src/components/SiteTitle.astro" },
      routeMiddleware: "./src/route-data.js",
      expressiveCode: {
        plugins: [pluginLabels(), pluginJsonSchema(), pluginReporter()],
        // Stock themes, so any could be swapped in without restyling
        themes: ["kanagawa-dragon", "ayu-light"],
        // A block's title says what it is (plugins/expressive-code-labels.js),
        // so its header is a caption in the code's background, over a
        // hairline, not an editor's tab bar, which reads as a file name
        styleOverrides: {
          frames: {
            editorTabBarBackground: ({ resolveSetting }) => resolveSetting("codeBackground"),
            // Transparent, since the hairline is the header's background,
            // under the title
            editorActiveTabBackground: "transparent",
            editorActiveTabBorderColor: "transparent",
            editorActiveTabIndicatorTopColor: "transparent",
            editorActiveTabIndicatorBottomColor: "transparent",
            editorTabBarBorderBottomColor: ({ resolveSetting }) => resolveSetting("borderColor")
          }
        },
        // What a program prints, like messages and reporter output, can't
        // be reformatted for a narrow code block the way code can, so it
        // wraps instead of scrolling
        defaultProps: {
          overridesByLang: {
            "text,plaintext,txt": { wrap: true, hangingIndent: 4 },
            // A command has the same frame as other code, titled
            // "Terminal", not a terminal window's, with its three dots
            "bash,sh,shell": { frame: "code" }
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
