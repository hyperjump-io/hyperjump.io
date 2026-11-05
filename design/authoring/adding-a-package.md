# Adding a package

To add a package to the site, add it to `sources.js` in this repo, with
the topic that lists it. Mark a package that isn't released yet
`unreleased`. Add its `src/content/docs/<repo>/` to `.gitignore`, since
the build copies its pages there.

Until the package's branch has a `website/` directory, its page links to
its README on GitHub. For what the placeholder shows, see
[Where pages come from](../components/content.md#where-pages-come-from).

A topic with more than one package needs a front page in this repo, at
`src/content/docs/<topic>/index.mdx`.

## Rebuilding the site when docs change

The site rebuilds when a docs repo sends a `docs-changed` event. To set up
a docs repo to send it:

1. Copy `.github/workflows/docs-changed.yml` from another docs repo. It
   sends the event when `website/` changes on the branch that the site
   builds from.
2. Share the org's `SITE_DISPATCH_CLIENT_ID` variable and
   `SITE_DISPATCH_APP_KEY` secret with the repo. The workflow uses them to
   get a token from the org's docs dispatch app.

For how deployment works, see [Deployment](../components/deployment.md).

## Checking the docs' style

Copy `.vale.ini` and `.claude/settings.json` from another docs repo, and
add `.vale/` to `.gitignore`. For what they do, see the
[style guide](../style/README.md).
