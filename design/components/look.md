# Look

Starlight's layout, with Hyperjump's branding. Overriding Starlight's
components for a custom design was rejected: it's more to keep working as
Starlight changes, for little gain on a docs site.

- **Logo.** The braces and lightning bolt from explore.hyperjump.io, in
  `src/assets/logo.svg`. It's inline, not an `<img>`, so CSS colors it: the
  braces in the text color and the bolt in the accent. The header's
  `SiteTitle` is overridden to inline it, and `src/route-data.js` puts it in
  the landing page's hero, since frontmatter can't import it. An external
  `<use href="/logo.svg#logo">` was tried first and didn't render. The
  favicon, `public/favicon.svg`, can't take the page's CSS, so its colors are
  fixed, following only the system's color scheme.
- **Color.** Forest green, as Starlight's accent in `src/styles/custom.css`.
  Starlight's text uses `accent-high` in the dark theme and `accent` in the
  light one, so those are the shades checked for contrast against the
  background. "Coming soon" markers are blue, so they don't look like "Added
  in" ones. It was picked by flipping through options on the site with a
  temporary toggle.
- **Code theme.** GitHub's dark and light themes, stock. Any code theme
  should be able to replace them without restyling anything, so nothing
  here, including JSON Schema highlighting, sets a color of its own for
  code: what it adds is weight, slant, underline, and the theme's own
  colors, like its color for comments.
  Picked by flipping through themes on a temporary test page. Rejected:
  Night Owl, Starlight's default (teal and purple on navy, away from the
  green); everforest (good in dark, not in light); catppuccin; vitesse;
  kanagawa; and adjusting GitHub's: JSON property names in the site's forest
  green or in the theme's own green, a gray background and medium blue
  strings in the light theme. Each looked better with GitHub's themes, but
  was a color chosen for them, which another theme would need chosen again.
- **Code block width.** A code block fits about 80 characters on a
  desktop and 77 at 1024 pixels wide, measured in a browser, so code in the
  docs is kept to 76. A phone scrolls anyway. What a program prints, like
  messages and reporter output, can't be reformatted like code, so `text`
  blocks wrap, with continued lines indented so they don't read as new
  ones. A block with a value that can't be broken, like a long URI in JSON,
  wraps with `wrap` in its fence. Rejected: wrapping all code. Wrapped code
  is harder to read than code formatted to fit.
- **404 page.** `src/content/docs/404.md`, a splash page like the landing
  page, with links to each package's docs. Without it, Starlight warns on
  every build that it has no 404 entry and uses its own.
- **Fonts.** IBM Plex Sans and IBM Plex Mono, from `@fontsource`, served with
  the site.
- **Landing page.** See [Landing page](landing-page.md). Its logo is
  smaller than Starlight's hero image, since the header shows it too.

Rejected colors: amber, which was the first choice, after the bolt in the
original logo; orange, coral, rust, red, yellow, rose, fuchsia, grape,
purple, violet, periwinkle, indigo, blurple, blue, cyan, teal, emerald,
green, and lime; and monochrome, like json-schema.hyperjump.io.
