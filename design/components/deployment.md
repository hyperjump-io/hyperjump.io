# Deployment

`.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages.
It runs on a push to `main`, on a manual run, and on a `docs-changed`
`repository_dispatch`, which the docs repos send when their `website/`
changes on the branch the site builds from. README.md has the workflow they
need.

## Not done yet

- This repo on GitHub, with Pages turned on and hyperjump.io as its custom
  domain.
- The docs-changed workflow in each docs repo, with a token that can dispatch
  here.
