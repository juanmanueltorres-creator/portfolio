# Juan Manuel Torres — Portfolio

> **Bilingual portfolio for geospatial software, public-data products and decision technologies.**

This repository contains the current React portfolio used to present selected projects, technical capabilities and contact paths without duplicating each project's full documentation.

**Live site:** https://juanmanueltorres-creator.github.io/portfolio/

---

## What this repository is

The portfolio is a presentation layer over project evidence that lives in the individual repositories and deployed applications.

Its job is to answer a small set of questions quickly:

```text
Who is Juan?
     ↓
What does he build?
     ↓
Which projects are worth opening?
     ↓
Where is the underlying evidence?
```

It is intentionally different from the project repositories themselves: implementation details, validation contracts, data provenance and limitations should remain closest to the systems that actually own them.

---

## Current site structure

The application currently renders:

- a bilingual ES / EN navigation and content layer;
- dark / light theme support;
- hero and skills sections;
- featured project presentation;
- additional project cards;
- expertise and contact sections;
- reusable project-content modules under `src/content/projects/`.

The content-driven project layer currently includes dedicated modules for:

- **GeoPlatform**;
- **Pulso Público Argentina**.

```text
src/content/projects/
├── geoplatform.ts
├── pulso.ts
└── index.ts
```

Project-specific content is separated from the generic presentation components so additional systems can be added without hard-coding every claim into one large UI file.

---

## Stack

`React 18` · `TypeScript 5.2` · `Vite 5` · `Material UI 5` · `i18next`

The repository also uses project-specific visualization dependencies where needed, including Leaflet / React Leaflet and Recharts.

---

## Architecture

```text
project content
     ↓
src/content/projects
     ↓
shared presentation contracts
     ↓
React sections / components
     ↓
ES / EN presentation
     ↓
Vite build
     ↓
GitHub Pages
```

The main application composes:

```text
Navbar
HeroSection
SkillsSection
FeaturedProjectSection
OtherProjectsSection
ExpertiseSection
ContactSection
Footer
```

Theme preference is stored locally in the browser.

---

## Run locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Production build:

```bash
npm run build
```

Preview the built site locally with:

```bash
npm run preview
```

---

## Deployment

The current deployment path is GitHub Pages through `.github/workflows/pages.yml`.

On pushes to `main`, the workflow:

```text
checkout
  ↓
Node setup
  ↓
npm install --legacy-peer-deps
  ↓
Vite build with /portfolio/ base path
  ↓
GitHub Pages artifact
  ↓
deploy
```

The latest checked deployment of `main` completed successfully at:

https://juanmanueltorres-creator.github.io/portfolio/

---

## Verification boundary

This repository currently defines build and preview scripts but no automated application-test script in `package.json`.

So the portfolio's current automated delivery evidence is the successful Vite build and GitHub Pages deployment. Behavioral and data-contract tests belong primarily to the individual product repositories linked from the site.

The portfolio should not be used as the authority for changing facts such as project test counts, operational status or detailed source contracts. Those claims belong in each canonical project repository.

---

## Related links

- **GitHub profile:** https://github.com/juanmanueltorres-creator
- **GeoPlatform:** https://sanjuangeo.vercel.app/
- **Pulso Público Argentina:** https://juanmanueltorres-creator.github.io/pulso-publico-argentina/
- **LinkedIn:** https://www.linkedin.com/in/juanmtorres23/

---

## Maintenance rule

> **The portfolio points to evidence; it should not become a second, stale source of truth.**

When a project changes materially, update the project's own documentation first and keep this repository limited to the minimum presentation metadata needed to route people toward the current work.
