# Deploying the site to GitHub Pages

The site lives in `site/` and is deployed automatically to:

```
https://<your-github-username>.github.io/production-rag-patterns-in-practice/
```

---

## One-time GitHub settings

1. Go to **Settings → Pages** in your repository.
2. Under **Source**, select **GitHub Actions** (not "Deploy from a branch").
3. Save. No branch or folder selection is needed — the workflow handles everything.

That is the only manual step required.

---

## How deployment works

Every push to `main` that touches `site/**` or
`.github/workflows/deploy-pages.yml` triggers the workflow at
`.github/workflows/deploy-pages.yml`, which:

1. Checks out the repo
2. Installs Node 20 and runs `npm install` inside `site/`
3. Runs `npm run build` — Vite outputs to `site/dist/`
4. Uploads `site/dist/` as the Pages artifact
5. Deploys the artifact via the official `actions/deploy-pages` action

You can also trigger a deploy manually: **Actions → Deploy GitHub Pages → Run workflow**.

---

## Local development

```bash
cd site
npm install        # first time only

npm run dev        # dev server at http://localhost:5173/production-rag-patterns-in-practice/
npm run build      # production build → site/dist/
npm run preview    # serve the build at http://localhost:4173/production-rag-patterns-in-practice/
```

> **Important:** the dev server and preview server both serve under the
> `/production-rag-patterns-in-practice/` subpath (matching GitHub Pages).
> Navigate to that path in your browser — the root `/` returns a 404 locally,
> just as it would on Pages.

---

## Verifying a build before pushing

```bash
cd site
npm run build && npm run preview
```

Open `http://localhost:4173/production-rag-patterns-in-practice/` and confirm:

- [ ] Page loads (not blank, no console 404s)
- [ ] Favicon appears in the browser tab
- [ ] Fonts render (Inter / JetBrains Mono)
- [ ] Nav links scroll to the correct sections
- [ ] Pattern cards load and filter correctly
- [ ] All "Notebook" links point to `github.com/…`

---

## Asset resolution under the subpath

All asset resolution is handled by Vite's `base` config in `site/vite.config.js`:

```js
base: '/production-rag-patterns-in-practice/'
```

This prefix is applied to:
- JS/CSS bundle URLs in the built HTML
- The favicon (`%BASE_URL%favicon.svg` in `index.html`)
- Any static files placed in `site/public/`

All internal navigation uses anchor links (`href="#patterns"` etc.), so there
are no client-side routes that could 404 under the subpath.

---

## Deploying to a custom domain (optional)

If you point a custom domain at this repo:

1. Add a `CNAME` file to `site/public/` containing your domain, e.g.:
   ```
   ragpatterns.example.com
   ```
2. Change `base` in `site/vite.config.js` to `'/'`.
3. Update the DNS CNAME record to point to `<your-github-username>.github.io`.
4. Enable "Enforce HTTPS" in Settings → Pages after DNS propagates.
