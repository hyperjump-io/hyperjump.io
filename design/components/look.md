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
- **Color.** Sage-olive green (hue 95°), as Starlight's accent in
  `src/styles/custom.css`: `#87af6a` in the dark theme and `#3f6b1f` in the
  light one. It's near the green of the code themes' strings, Dragon's sage
  and Ayu Light's olive, and warm and muted like them. Starlight's accent
  text, for links and filled highlights like the current page and the main
  button, is `accent` in both themes. Starlight's dark theme uses
  `accent-high`, which made links hard to tell from text and highlights the
  brightest things on the page. `accent` is 7.1:1 against the background
  in the dark theme and 6.3:1 in the light one, and `accent-low`, the text
  on its fills, is 6.1:1 and 5.6:1 against it. "Coming soon" markers are
  blue, so they don't look like "Added in" ones. Picked by flipping through
  options on the site with a temporary toggle, first among named colors and
  later among greens, next to the code themes. Rejected:
  - Forest green (`#5bb37a`, hue 141°), the color before this one. It was bluer
    than the code themes' greens, and cool next to them.
  - A pure green (120°), generic, and no closer to the code, and one
    between forest and sage-olive (115°).
  - Making only the fills the accent in the dark theme, which left links
    pale, and needed a rule for each place Starlight uses the color.
- **Code theme.** Kanagawa Dragon in the dark theme and Ayu Light in the
  light one, stock. Both are warm and muted, with green strings near the
  site's green. They needn't be from one family, only look like one site.
  Any code theme should be able to replace them without restyling
  anything, so nothing here, including JSON Schema highlighting, sets a
  color of its own for code: what it adds is weight, slant, underline, and
  the theme's own colors, like its color for comments.
  Picked with a temporary switcher on the site: Expressive Code takes extra
  themes, styled under `.expressive-code[data-theme='<name>']`, so a script
  set that on each block, with a picker for dark and one for light. In the
  light theme it had to copy the extra themes' rules out of Expressive
  Code's cascade layer, since Starlight's rule for its light code theme is
  more specific. Rejected:
  - GitHub's themes, the first choice. They're built around GitHub's blue:
    coral keywords next to green links read as red against green, once the
    dark theme's accent was the bolt's green.
  - Kanagawa Lotus, Dragon's light theme: a parchment-yellow background
    that stood out on a white page.
  - Kanagawa Wave, Vitesse, Everforest, Catppuccin, Nord, Vesper, One,
    Dark+ and Light+, Ayu Dark and Mirage, Material, Gruvbox, Rosé Pine,
    Min, Solarized, Night Owl, and the other GitHub themes, side by side
    in the switcher.
  - Adjusting GitHub's: JSON property names in the site's green or
    in the theme's own green, a gray background and medium blue strings in
    the light theme. Each looked better, but was a color chosen for one
    theme, which another theme would need chosen again.
- **Code block width.** A code block fits about 80 characters on a
  desktop and 77 at 1024 pixels wide, measured in a browser, so code in the
  docs is kept to 76. A phone scrolls anyway. What a program prints, like
  messages and reporter output, can't be reformatted like code, so `text`
  blocks wrap, with continued lines indented so they don't read as new
  ones. A block with a value that can't be broken, like a long URI in JSON,
  wraps with `wrap` in its fence. Output that's a table, like the CLI's,
  doesn't wrap (`wrap=false` in its fence), and scrolls, since wrapping
  breaks its columns apart. Rejected: wrapping all code. Wrapped code is
  harder to read than code formatted to fit.
- **Code in headings.** Set apart by its font, without the background
  inline code has, which made a block of gray as big as the heading.
- **Tables.** Code in a table's first column, which names things like lint
  rules, doesn't break at hyphens, from 64rem wide. On a narrower screen it
  does, since a name on one line left the next column a sliver.
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
