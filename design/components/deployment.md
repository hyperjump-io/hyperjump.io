# Deployment

`.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages.
It runs on a push to `main`, on a manual run, and on a `docs-changed`
`repository_dispatch`, which the docs repos send when their `website/`
changes on the branch the site builds from, with
`.github/workflows/docs-changed.yml`. Its branch has to match the repo's
`ref` in `sources.js`.

## Not done yet

- This repo on GitHub, with Pages turned on and hyperjump.io as its custom
  domain.
- A `SITE_DISPATCH_TOKEN` secret in each docs repo, a token that can dispatch
  here.
