# Deployment

`.github/workflows/deploy.yml` builds the site and deploys it to GitHub Pages.
It runs on a push to `main`, on a manual run, and on a `docs-changed`
`repository_dispatch`, which the docs repos send when their `website/`
changes on the branch the site builds from, with
`.github/workflows/docs-changed.yml`. Its branch has to match the repo's
`ref` in `sources.js`.

The docs repos dispatch with a token from a GitHub App, made by
`actions/create-github-app-token` for each run, with Contents write on
`hyperjump.io` only. It expires within the hour, and the app's private key
doesn't expire, so there's nothing to renew. Rejected: a fine-grained
personal access token. It expires in a year at most, and GitHub has no API
to make a new one, so the dispatches would fail until someone noticed and
replaced it by hand. It's also tied to whoever made it.

## Not done yet

- This repo on GitHub, with Pages turned on and `hyperjump.io` as its custom
  domain.
- The docs dispatch app's `SITE_DISPATCH_CLIENT_ID` variable and
  `SITE_DISPATCH_APP_KEY` secret, shared with each docs repo.
