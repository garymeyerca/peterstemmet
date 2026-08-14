# Peter Stemmet consulting website

A fast, dependency-free one-page consulting site focused on media training, executive communication and event moderation.

## Run locally

```sh
npm start
```

Then open `http://localhost:4173`.

## Verify

```sh
npm run check
```

The contact form intentionally opens the visitor's email app. It does not transmit or store form data. Replace this with a hosted form or CRM endpoint when one is selected.

## Production domain cutover

The temporary site is hosted at `https://garymeyerca.github.io/peterstemmet/` while Cloudflare DNS is being updated. When `peterstemmet.com` points to this deployment:

1. Change `og:url`, `og:image`, and `twitter:image` in `index.html` from the temporary GitHub Pages URLs to `https://peterstemmet.com/` URLs.
2. Confirm the canonical URL, sitemap, robots file, structured data, and social metadata all use the production domain.
3. Verify `https://peterstemmet.com/assets/social-share.jpg` is publicly available, then refresh the major social-platform preview caches.
