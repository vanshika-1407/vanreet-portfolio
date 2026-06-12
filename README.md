# Vanreet Portfolio — React + Vite

A portfolio website for **Vanreet** — Vanshika & Manpreet's UGC creator duo.

## Project Structure

```
vanreet-portfolio/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← All components, data & styles
│   ├── index.css      ← Minimal base reset
│   └── main.jsx       ← React root entry
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .gitignore
```

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Deploy to Vercel

### Option 1 — Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2 — Vercel Dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy** — done!

The `vercel.json` file handles SPA routing automatically.

## Customisation Tips

All content data is defined as constants near the top of `src/App.jsx`:
- `SERVICES` — services list
- `PORTFOLIO` — portfolio items (add real project images later)
- `TESTIMONIALS` — client reviews
- `PACKAGES` — pricing packages
- `FAQ_DATA` — FAQ entries
- `H_STATS`, `WHY`, `CREATOR_TAGS` — hero & why-us data

To add a real photo, replace the `.img-frame` placeholder in the Hero section with an `<img>` tag pointing to your image in `/public/`.

---
Made with ❤️ · वनरीत
