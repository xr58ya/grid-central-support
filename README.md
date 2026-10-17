# Grid Central Support

This is the place to report problems, suggest features and get help with Grid Central.

- **Something broken?** [Report a bug](https://github.com/xr58ya/grid-central-support/issues/new?template=bug_report.yml)
- **Have an idea?** [Request a feature](https://github.com/xr58ya/grid-central-support/issues/new?template=feature_request.yml)
- **Stuck setting something up?** [Ask for setup help](https://github.com/xr58ya/grid-central-support/issues/new?template=setup_help.yml)

**Learning Grid Central?** The [training guide](guide/README.md) covers every feature and how to set it up, step by step.

Before opening a new issue, please [search the existing ones](https://github.com/xr58ya/grid-central-support/issues?q=is%3Aissue). If someone has already reported the same thing, add a 👍 and any extra detail as a comment.

Prefer email, or need to share something privately (such as an account or beta code)? Write to **support.gridcentral@gmail.com**.

## Own-domain version (Cloudflare Pages, not live yet)

The same site can also run on Cloudflare Pages at help.gridcentral.store, where the report form sends private
tickets (with attachments) instead of opening GitHub, and an admin at admin.gridcentral.store for answering them.
It isn't live: the owner's step-by-step setup is in [support/cloudflare-setup.md](support/cloudflare-setup.md).
GitHub Pages (Jekyll) ignores these files.

- **Build command** `npm run build`, **output directory** `dist` (also in `wrangler.toml`). The build copies the
  pages and the admin and turns `guide/*.md` into HTML; it only needs the pinned `marked` package.
- **API**: `functions/` (Cloudflare Pages Functions), with shared code in `lib/`. `POST /api/tickets` takes the form;
  `/api/admin/*` is the admin, behind Cloudflare Access and checked again in every function.
- **Addresses** (`lib/site.js`): one Pages project, two custom domains. help.gridcentral.store serves the public
  pages, the guide (`/guide`), `/api/tickets` and `/api/config`; admin.gridcentral.store serves the admin page at `/`
  (from `dist/admin/`) and `/api/admin/*`, and Access locks that whole address. `functions/_middleware.js` keeps them
  apart: public pages on the admin address and `/admin` on the help address forward to the other one, and each
  address answers "not found" for the other's API. The `*.pages.dev` addresses forward to the right one and close
  the whole API, because Access doesn't cover them. On localhost everything works on one address, the admin at
  `/admin/`. gridcentral.store (the website) and api.gridcentral.store (payments) belong to development.
- **Send limits** (`lib/tickets.js`): 5 tickets an hour per sender, 20 an hour and 35 a day in all, so Resend's free
  100 emails a day leave room for replies.
- **Database**: Cloudflare D1, set up with `migrations/0001_init.sql`. **Files**: a private R2 bucket.
- **Secrets** are only ever added in the Cloudflare dashboard; `wrangler.toml` lists their names.
- **Tests**: `npm test` (needs Node 22.13 or newer for its built-in SQLite; no network or Cloudflare account needed).
- **Try it locally**: put test values in `.dev.vars` (never committed), for example Turnstile's test keys
  `TURNSTILE_SITE_KEY=1x00000000000000000000AA` and `TURNSTILE_SECRET=1x0000000000000000000000000000000AA`, plus
  `ADMIN_EMAILS=you@example.com` and `LOCAL_DEV_ADMIN=you@example.com` (only works on localhost), then
  `npx wrangler d1 migrations apply grid-central-support --local` and `npm run dev`.
