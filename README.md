# Ken's Blog

A minimal, typographic blog built with Astro and Tailwind CSS.

## Design

- **Style:** Swiss Modernism 2.0
- **Typography:** Barlow Condensed (display) + Space Grotesk (body)
- **Palette:** Black, grey, and white

## Tech Stack

- **Framework:** Astro 6.x
- **Styling:** Tailwind CSS (via PostCSS)
- **Language:** TypeScript
- **Testing:** Vitest + Playwright
- **Deployment:** Cloudflare Pages

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm test` — Run unit tests
- `npm run test:e2e` — Run E2E tests

## Deploy to Cloudflare Pages

### Option 1: GitHub Actions (Recommended)

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages
3. Create a new project, connect your GitHub repo
4. Add these secrets to your GitHub repo (Settings → Secrets):
   - `CLOUDFLARE_ACCOUNT_ID` — Found in Cloudflare dashboard sidebar
   - `CLOUDFLARE_API_TOKEN` — Create one at https://dash.cloudflare.com/profile/api-tokens with "Cloudflare Pages:Edit" permission

The GitHub Action will auto-deploy on every push to `main`.

### Option 2: Manual Deploy with Wrangler

```bash
# Install Wrangler CLI
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Build the site
npm run build

# Deploy dist folder
wrangler pages deploy dist --project-name=ken-blog
```

### Option 3: Direct Upload

```bash
npm run build
# Then upload the dist/ folder via Cloudflare Dashboard → Pages → Upload
```
