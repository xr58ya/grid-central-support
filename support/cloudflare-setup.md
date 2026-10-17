# Setting up help.gridcentral.store and admin.gridcentral.store on Cloudflare

This guide sets up Grid Central's own support site: the report form sends tickets to a private database instead of
public GitHub issues, customers get an email with their ticket number, and you answer them from an admin page.
Everything is clicked together in websites; you don't need to install or type any code.

The support site uses two addresses. Both come from the same Cloudflare project, so you only set it up once:

- **help.gridcentral.store**: the support home page, the report form, the privacy page and the training guide (at
  help.gridcentral.store/guide). This is the address testers will use.
- **admin.gridcentral.store**: the admin, where you read and answer tickets. Only you can open it, now and after
  going live. Development may later add membership pages to it; the lock stays the same.

> **The rest of gridcentral.store isn't part of this.** gridcentral.store itself is for the Grid Central website
> and api.gridcentral.store for the payments server; development looks after both. This guide never asks you to add,
> change or delete a DNS record for either of them. If Cloudflare or another site offers to change those, say no
> and ask development.

> **Don't go live until you decide to.** From step 10 until the last section ("Going live"), both addresses are
> locked so only you can open them. Cloudflare's own address for the project (`grid-central-support.pages.dev`)
> only forwards to the two addresses above, so it can't be used to get around the lock. Testers keep using the
> current support site and email as they do now. Nothing changes for them until you choose to switch, and you can
> stop at any step.

> **Keys stay secret.** Some steps show you a key (Turnstile's secret key, Resend's API key). Copy it straight from
> the page that shows it into Cloudflare's **Variables and Secrets** (step 11). Never paste a key into a chat
> (including with Claude), an email, GitHub, or a document. If a key ever ends up somewhere it shouldn't, delete it
> where you made it and make a new one.

## What you'll end up with

| Part | What it does | Cost |
|---|---|---|
| Cloudflare (domain) | Runs gridcentral.store's DNS | Free |
| Cloudflare Pages | The support site and guide at help.gridcentral.store, the admin at admin.gridcentral.store | Free |
| D1 database | Tickets, their history and your notes | Free (5 GB) |
| R2 storage | Attached files (logs, screenshots), private | Free up to 10 GB, needs a card on file |
| Turnstile | The "are you human" box that keeps out spam | Free |
| Access (Zero Trust) | The sign-in in front of the admin (and, until you go live, the whole support site) | Free up to 50 people |
| Email Routing | support@gridcentral.store forwards to support.gridcentral@gmail.com | Free |
| Resend | Sends the emails (ticket numbers, your replies) | Free: 3,000 a month, 100 a day |

Each ticket sends two emails (one to the customer, one to you). So that your replies always have room within
Resend's free 100 a day, the form takes up to 35 tickets a day (and 20 an hour); after that it asks people to try
again later or to email support.gridcentral@gmail.com. If you move to a paid Resend plan, ask the help desk to raise
the limit.

## Before you start

- About an hour, plus waiting time while the domain moves over (usually under an hour, at most a day).
- Your login for the company where you bought **gridcentral.store** (your "registrar").
- A payment card. Cloudflare asks for one before it turns on R2 storage (and maybe Zero Trust), even on the free
  plans. You aren't charged unless you go over the free amounts.
- The address **support.gridcentral@gmail.com** open in another tab, for verification emails.
- The site is built from the help desk's branch `claude/own-domain` on GitHub. The help desk keeps it up to date,
  and every change it makes there is published by itself. It stays off `main` until you go live: merging into `main`
  would also change the current GitHub Pages site. Steps 1 to 7 can be done any time; step 8 needs the database ID
  from step 3 in that branch.

---

## 1. Create a Cloudflare account

1. Go to **dash.cloudflare.com/sign-up**.
2. Enter your email address and a strong password, then press **Sign up**.
3. Open the email from Cloudflare and click the link to verify your address.
4. Turn on two-factor sign-in: click your account icon (top right) → **Profile** → **Authentication** →
   **Two-Factor Authentication**, and follow the steps. This account will hold customer data, so please don't skip it.

## 2. Add gridcentral.store and change its nameservers

1. In the Cloudflare dashboard, on the home page, press **Add a domain** (it may say **Onboard a domain**).
2. Type `gridcentral.store`, leave **Quick scan for DNS records** selected, and press **Continue**.
3. Choose the **Free** plan and press **Continue**.
4. Cloudflare lists the DNS records it found. If the domain already has a website or email somewhere, check those
   records are listed (ask the help desk if you're unsure). Leave any records for `gridcentral.store` itself or
   `api` exactly as they are: those are development's. Press **Continue to activation**.
5. Cloudflare shows **two nameservers**, for example `ada.ns.cloudflare.com` and `bob.ns.cloudflare.com`. Keep this
   page open.
6. In another tab, sign in to your registrar and find the domain's **Nameservers** setting (sometimes under
   "DNS" or "Manage domain"). If **DNSSEC** is switched on there, switch it off first.
7. Choose "custom nameservers", replace the ones there with Cloudflare's two, and save.
8. Back in Cloudflare, press **Check nameservers now**. It can take from a few minutes to a day. Cloudflare emails you
   when gridcentral.store is **Active**. You can carry on with steps 3 to 5 while you wait. Steps 6 and 7 need
   gridcentral.store to be **Active** first (until then the rest of the internet can't see the records you add).

## 3. Create the database (D1)

1. In the left menu, open **Storage & databases** → **D1 SQL database**.
2. Press **Create database** (or **+ Create**).
3. Name it exactly `grid-central-support`. Leave the location on automatic. Press **Create**.
4. The database's page opens. Find **Database ID** (a long code like `1a2b3c4d-…`) and copy it.
   **Send this ID to the help desk**: it goes in the file `wrangler.toml` on the `claude/own-domain` branch, in place
   of `REPLACE-WITH-THE-D1-DATABASE-ID`. The ID isn't a secret (it only works together with your Cloudflare login),
   so it's fine to paste it in a chat.
5. Now set up the tables. In another tab, open
   https://github.com/xr58ya/grid-central-support/blob/claude/own-domain/migrations/0001_init.sql (the file is only
   on that branch until you go live). Press the **Copy raw file** button (two overlapping squares, top right of the
   file).
6. Back on the database page, open the **Console** tab, paste everything into the box, and press **Execute**.
7. Check it worked: open the **Tables** tab (or reload). You should see `counters`, `tickets`, `ticket_files` and
   `ticket_events`. Running the file again later does no harm.

If the Console shows an error, don't worry: send the help desk the error message (it never contains a key).

## 4. Create the file storage (R2)

1. In the left menu, open **Storage & databases** → **R2 object storage**.
2. The first time, Cloudflare asks you to add a payment method and turn on R2. Follow its steps (the first 10 GB are
   free).
3. Press **Create bucket**.
4. Name it exactly `grid-central-support-files`. Leave the location on automatic and the storage class on
   **Standard**. Press **Create bucket**.
5. **Leave it private.** Don't turn on **Public access**, the **r2.dev** address or a custom domain in the bucket's
   settings. Files are only opened through the admin page.

## 5. Create the Turnstile check

1. In the left menu, open **Turnstile** (it may be under **Application security**).
2. Press **Add widget**.
3. **Widget name**: `Grid Central support form`.
4. **Hostnames**: add `help.gridcentral.store` only. (The form is only on that address; the admin address and the
   `pages.dev` address forward there.)
5. **Widget mode**: **Managed**. Pre-clearance: **No**.
6. Press **Create**.
7. Cloudflare shows a **Site Key** and a **Secret Key**. You'll copy both into Cloudflare in step 11. You can come back
   to this page any time to see them again (Turnstile → the widget → **Settings**), so there's no need to save them
   anywhere else.

## 6. Set up Resend (sending email)

Wait until gridcentral.store is **Active** (step 2).

1. Go to **resend.com** and sign up (you can use support.gridcentral@gmail.com). Turn on two-factor sign-in in your
   Resend account settings.
2. Open **Domains** → **Add Domain**. Type `gridcentral.store`, choose the region closest to you, and press **Add**.
3. Resend lists a few DNS records (MX and TXT records, mostly for `send` and `resend._domainkey`).
   - If Resend offers to add them to Cloudflare for you (a button to sign in to Cloudflare), use it and approve.
   - Otherwise add each one by hand: in Cloudflare, open **gridcentral.store** → **DNS** → **Records** →
     **Add record**. Copy the **Type**, **Name** and **Content/Value** (and **Priority** for the MX record) exactly
     from Resend, leave TTL on **Auto**, and press **Save**. Repeat for each record.
   - These records live on `send.gridcentral.store` and `resend._domainkey`, so they don't clash with Email Routing
     in step 7.
4. Back in Resend, press **Verify DNS Records**. It can take a few minutes. Wait until the domain says **Verified**.
5. Open **API Keys** → **Create API Key**. Name: `Grid Central support site`. Permission: **Sending access**.
   Domain: `gridcentral.store`. Press **Add**.
6. Resend shows the key **only once** (it starts with `re_`). Keep this tab open and go straight to step 11 to put it
   in Cloudflare, or come back and make a new key later if you lose it. Don't save it anywhere else.

## 7. Forward support@gridcentral.store to Gmail (Email Routing)

Customers' replies to Grid Central's emails go to support@gridcentral.store. This forwards them to
support.gridcentral@gmail.com. Wait until gridcentral.store is **Active** (step 2).

> If gridcentral.store already receives email somewhere else (for example Google Workspace), stop here and ask the
> help desk first: turning on Email Routing would replace that.

1. In Cloudflare, open **gridcentral.store** → **Email** → **Email Routing**, and press **Get started** (or
   **Enable Email Routing**).
2. **Custom address**: `support`. **Action**: **Send to an email**. **Destination**: `support.gridcentral@gmail.com`.
   Press **Create and continue**.
3. Cloudflare emails support.gridcentral@gmail.com. Open that email and click **Verify email address**.
4. Back in Cloudflare, press **Add records and enable**. Cloudflare adds the email records itself.
5. Test it: from another email address, send a message to support@gridcentral.store. It should arrive in the Gmail
   inbox within a minute or two.

## 8. Create the Pages project (the website)

Wait until the help desk tells you the database ID from step 3 is in `wrangler.toml` on the `claude/own-domain`
branch. (If it isn't, the first build stops with an error about `database_id`. That does no harm: once the help desk
has added the ID, Cloudflare starts a new build by itself. Open **Deployments** and check the newest one.)

1. In the left menu, open **Workers & Pages** → **Create application** → the **Pages** tab → **Import an existing Git
   repository** (or **Connect to Git**).
2. Choose **GitHub** and sign in. When GitHub asks which repositories Cloudflare may see, pick
   **Only select repositories** → `xr58ya/grid-central-support`, then **Install & Authorize**.
3. Select `grid-central-support` and press **Begin setup**.
4. Fill in:
   - **Project name**: `grid-central-support`
   - **Production branch**: `claude/own-domain` (it becomes `main` when you go live)
   - **Framework preset**: **None**
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: leave empty
   - Leave environment variables empty for now (step 11).
5. Press **Save and Deploy**. The first build takes a minute or two.
6. Stop other branches from being published with access to the real database: open the project → **Settings** →
   **Builds** (or **Build & deployments**) → **Branch control** → set **Preview branches** to **None** → **Save**.

Cloudflare also gives the project an address like `grid-central-support.pages.dev`. It only forwards to
help.gridcentral.store and admin.gridcentral.store, so until step 9 it leads nowhere. That's expected.

## 9. Connect help.gridcentral.store and admin.gridcentral.store

Connect **both** addresses before the lock in step 10: Cloudflare can't connect an address once a lock is already on
it. Until step 10, anyone who finds the addresses only sees the public pages (the same as the current support site):
the form can't send and the admin is closed, because the keys aren't in yet (step 11).

1. Open **Workers & Pages** → **grid-central-support** → **Custom domains** → **Set up a custom domain**.
2. Type `help.gridcentral.store` and press **Continue**, then **Activate domain**. Cloudflare adds the DNS record
   itself.
3. Press **Set up a custom domain** again, type `admin.gridcentral.store`, and press **Continue**, then **Activate
   domain**.
4. Wait until both say **Active** (a few minutes) before going on.

These are the only two DNS records this guide adds for the website (Cloudflare adds them for you). Don't add any for
gridcentral.store itself or for `api`.

## 10. Lock both addresses with Cloudflare Access

This puts a sign-in page in front of both addresses, so nobody else can see them. The admin's lock stays for good.
The lock on help.gridcentral.store is only for while you're testing: you remove it when you go live. (Cloudflare
renames these menus now and then; the names in brackets are older ones.)

1. In the left menu, open **Zero Trust**. The first time, Cloudflare asks for a **team name**: type something like
   `gridcentral`. Your team domain becomes `gridcentral.cloudflareaccess.com`: that's the value for
   `ACCESS_TEAM_DOMAIN`. Choose the **Free** plan.
2. First, a small opening so Cloudflare can renew the two addresses' security certificates through the locks. Open
   **Access controls** → **Applications** → **Create new application** (or **Access** → **Applications** → **Add an
   application**) → **Self-hosted** (it may say **Self-hosted and private**).
   - **Application name**: `Certificate renewal`.
   - **Add public hostname**: subdomain `help`, domain `gridcentral.store`, path `.well-known/acme-challenge`.
   - Press **Add public hostname** again: subdomain `admin`, domain `gridcentral.store`, path
     `.well-known/acme-challenge`.
   - Add a policy: **Policy name** `Everyone`, **Action** **Bypass**, **Include** → **Everyone**. Save the policy
     and the application. Leave this one in place for good.
3. Now the admin's lock. Create a second application the same way. **Application name**: `Grid Central admin`.
   **Session duration**: 24 hours.
   - **Add public hostname**: subdomain `admin`, domain `gridcentral.store`, path **empty** (empty = the whole
     address).
   - Add a policy: **Policy name** `Owner only`, **Action** **Allow**, **Include** → **Emails** → your email address
     (the same one you'll put in `ADMIN_EMAILS`). Save the policy.
   - **Login methods**: new Zero Trust teams sign you in with your **Cloudflare account** by default. Either keep
     that, and use the email you sign in to Cloudflare with in the policy and in `ADMIN_EMAILS`; or add **One-time
     PIN** (Zero Trust → **Integrations** → **Identity providers** → **Add new identity provider** → **One-time PIN**)
     to get a sign-in code by email at the address in the policy. Save the application.
4. Open the **Grid Central admin** application again and find **Application Audience (AUD) Tag**. You'll copy it into
   `ACCESS_AUD` in step 11, and the team domain into `ACCESS_TEAM_DOMAIN`. (Only this application's tag: not the
   one in the next step.)
5. Now the testing lock on the support site. Create a third application the same way. **Application name**:
   `Support site (testing lock)`. **Session duration**: 24 hours.
   - **Add public hostname**: subdomain `help`, domain `gridcentral.store`, path **empty**.
   - Add the same kind of policy: **Policy name** `Owner only`, **Action** **Allow**, **Include** → **Emails** →
     your email address. Use the same login method as in step 3. Save the policy and the application.
6. Check it: open a private browser window and go to https://help.gridcentral.store, then
   https://admin.gridcentral.store. Both should show Cloudflare's sign-in page, not the site.

The admin checks the sign-in itself as well, so it only opens for an address on `ADMIN_EMAILS` with a real Access
sign-in to the **Grid Central admin** application.

## 11. Add the keys and settings (Variables and Secrets)

1. Open **Workers & Pages** → **grid-central-support** → **Settings** → **Variables and Secrets**.
2. For each line below, press **Add**, choose type **Secret**, type the **Variable name** exactly as shown, paste the
   value, and press **Save**. Use the **Production** environment.

| Variable name | Value |
|---|---|
| `TURNSTILE_SITE_KEY` | Turnstile's **Site Key** (step 5) |
| `TURNSTILE_SECRET` | Turnstile's **Secret Key** (step 5) |
| `RESEND_API_KEY` | Resend's API key (step 6) |
| `OWNER_EMAIL` | Where "new ticket" emails should go: `support.gridcentral@gmail.com` (the privacy page says copies go to that Gmail inbox). More than one? Separate them with commas. |
| `ADMIN_EMAILS` | The email address you sign in to the admin with (step 10.3). More than one? Separate them with commas. |
| `ACCESS_TEAM_DOMAIN` | From step 10, for example `gridcentral.cloudflareaccess.com` |
| `ACCESS_AUD` | From step 10.4, the **Grid Central admin** application's "Application Audience (AUD) Tag" |

3. Settings only take effect on the next deployment: open **Deployments**, then on the latest one press **⋯** →
   **Retry deployment**. Do this again whenever you change a setting. (Retry builds the same version again with the
   new settings. A change from the help desk doesn't need it: Cloudflare builds that by itself.)

## 12. Try everything (still private)

1. Open https://help.gridcentral.store and sign in (with your Cloudflare login, or the code Cloudflare emails
   you). The home page and the training guide (https://help.gridcentral.store/guide) open and look like the current
   support site.
2. On **Report a problem**, fill in a test report with your own email address. Attach a screenshot and a small
   companion.log, tick the "are you human" box, and press **Send**. You should see a ticket number (GC-1001).
3. Within a few minutes: the customer email ("We've got your report") arrives at the address you typed, and the
   "New bug report" email arrives at `OWNER_EMAIL`. Check spam if not.
4. Open https://admin.gridcentral.store (sign in again if it asks). The ticket is in the list. The link in the
   "New bug report" email opens it too. Open it and check:
   - the answers and the files (press **Download**; screenshots show in the page),
   - **Status**: pick **Confirmed**, tick **Email the customer about the new status**, press **Save**, and check the
     email arrives,
   - **Reply**: send a reply and check it arrives; then reply to that email from your inbox and check it reaches
     support.gridcentral@gmail.com,
   - **Private note**: add one (it's never emailed),
   - **Copy for development**: press it and paste the result somewhere to see it.
5. Delete the test ticket (**Delete ticket…**, then type its number). Real tickets carry on from the next number.
   If you want real tickets to start at GC-1001 again, delete every test ticket, then paste this in the database's
   **Console** (step 3) and press **Execute**:
   `UPDATE counters SET value = (SELECT COALESCE(MAX(id), 1000) FROM tickets) WHERE name = 'ticket';`
   (If a ticket is still there, numbering carries on after it instead.)

If something doesn't work, the ticket's **History** in the admin shows each email and whether it was sent. The
messages below cover the usual causes.

## When someone asks for their data to be deleted

Open their ticket in the admin and press **Delete ticket…**. That removes the ticket, its history and its files. It
can't reach your inbox, so afterwards search Gmail for the ticket number (for example `GC-1001`) and delete those
emails too: the "New bug report" email and any emails from the customer.

## Going live: only when you decide

Nothing in the steps above makes the site public. When you're happy with it and want testers to use it:

1. In **Zero Trust** → **Access controls** → **Applications**, delete the **Support site (testing lock)**
   application (open it → **Delete**, or **⋯** → **Delete**). Leave **Grid Central admin** and **Certificate
   renewal** exactly as they are. No secrets change.
2. Check in a private window: https://help.gridcentral.store and its report form open without signing in;
   https://admin.gridcentral.store still asks you to sign in.
3. In **Workers & Pages** → **grid-central-support** → **Settings** → **Builds** → **Branch control**, change the
   **Production branch** to `main` and save. The site stays as it is until the next step.
4. On GitHub, merge the `claude/own-domain` pull request into `main`, the same way as earlier support-site changes
   (ask the help desk to open it if there isn't one). Merging starts a new build from `main`: check that the newest
   deployment under **Deployments** finishes.
5. From then on, the old GitHub Pages address (xr58ya.github.io/grid-central-support) sends people to
   https://help.gridcentral.store. Ask the help desk to point the GitHub README and the guide there, and
   development to update the link in the app (and on the website, if it links to support), then tell testers.

To undo it before step 3, make the **Support site (testing lock)** application again (step 10.5).

## If something goes wrong

| What you see | What to do |
|---|---|
| The build fails with a message about `database_id` | The database ID isn't in `wrangler.toml` on the production branch yet (step 3). Once the help desk has added it, Cloudflare builds again by itself. |
| A custom domain stays on **Verifying** (step 9) | An Access application already covers that address. Delete the application for it in Zero Trust (**Grid Central admin** or **Support site (testing lock)**), wait until the domain is **Active**, then make it again (step 10). |
| The form says "Sending from this page isn't available right now" | `TURNSTILE_SITE_KEY` or `TURNSTILE_SECRET` is missing, or you haven't pressed **Retry deployment** since adding them. |
| The "are you human" box shows an error | `help.gridcentral.store` isn't in the Turnstile widget's **Hostnames** (step 5). |
| Sending says the "are you human" check "couldn't be confirmed on our side", every time | Usually `TURNSTILE_SECRET` isn't the widget's **Secret Key**. Copy it again (step 5) and **Retry deployment**. |
| The form says "We've had a lot of tickets today" | The daily limit (35 tickets, to stay within Resend's free plan). It resets at midnight UTC. |
| The admin says "isn't set up yet" | One of `ADMIN_EMAILS`, `ACCESS_TEAM_DOMAIN` or `ACCESS_AUD` is missing. Add it and **Retry deployment**. |
| The admin says "This account isn't allowed" | The email you signed in with isn't on `ADMIN_EMAILS`. If you sign in with your Cloudflare account, it's that account's email. |
| The admin says the sign-in "couldn't be checked" | `ACCESS_AUD` doesn't match the **Grid Central admin** application's AUD tag (a common mix-up is the testing lock's tag), or `ACCESS_TEAM_DOMAIN` is wrong. Copy both again (step 10.4). |
| No emails arrive | Open the ticket in the admin: its History shows the email error. Usually the Resend domain isn't **Verified** yet, or `RESEND_API_KEY` is missing. |
| Sending a big file fails with "Error 1102" | The free plan limits how long each request may compute. Leave the file off, or upgrade to Workers Paid ($5 a month). |

Stuck? Ask the help desk, and say which step you're on and what the page shows. Never include a key.
