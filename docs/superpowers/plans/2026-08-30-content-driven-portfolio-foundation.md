# Content-Driven Portfolio Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move GeoPlatform editorial/project data out of `FeaturedProjectSection.tsx` into a typed reusable content layer while preserving the current UI, EN/ES behavior, links, assets, and static build.

**Architecture:** Introduce compile-time TypeScript content under `src/content/`, with a small `ProjectContent` contract and one `geoplatform` content object. `FeaturedProjectSection.tsx` remains the presentation layer and selects the active project locale from `i18next`, falling back deterministically to English. Site-wide UI labels remain in `react-i18next`; only GeoPlatform-specific editorial content moves to the project object.

**Tech Stack:** React 18, TypeScript 5.2, Vite 5, MUI 5, react-i18next/i18next.

**Spec:** `docs/superpowers/specs/2026-08-30-content-driven-portfolio-foundation-design.md`

## Global Constraints

- Preserve the existing visual appearance as closely as practical.
- Preserve the current `App.tsx` composition and section order.
- Preserve English/Spanish language switching.
- Preserve existing public links and image paths.
- Add no runtime dependencies.
- Do not change Vite configuration.
- Do not introduce a CMS, database, backend, router, Markdown parser, or MDX tooling.
- Do not refactor unrelated sections.
- Keep the current Vercel/static build flow.
- `npm run build` must pass before completion.
- Do not migrate `OtherProjectsSection` in this phase.

---

## File Structure

### Create

- `src/content/types.ts` — shared content contracts only.
- `src/content/projects/geoplatform.ts` — GeoPlatform project data in EN/ES plus image, architecture, and links.
- `src/content/projects/index.ts` — explicit project export/registry seam.

### Modify

- `src/sections/FeaturedProjectSection.tsx` — consume `geoplatform` content and keep all MUI layout/styling/rendering responsibility.
- `src/i18n/en.json` — remove GeoPlatform-specific editorial keys that moved into `ProjectContent`; keep generic action-button labels.
- `src/i18n/es.json` — same boundary as English.

### Intentionally unchanged

- `src/App.tsx`
- `src/sections/OtherProjectsSection.tsx`
- theme files
- Vite config
- package dependencies
- deployment configuration

---

### Task 1: Add the typed project-content contract and GeoPlatform data

**Files:**
- Create: `src/content/types.ts`
- Create: `src/content/projects/geoplatform.ts`
- Create: `src/content/projects/index.ts`

**Interfaces:**
- Produces: `SupportedLocale`, `ProjectStatus`, `ProjectLocaleContent`, `ProjectArchitectureGroup`, `ProjectLinks`, `ProjectContent` from `src/content/types.ts`.
- Produces: `geoplatformProject: ProjectContent` from `src/content/projects/geoplatform.ts`.
- Produces: named export `geoplatformProject` from `src/content/projects/index.ts`.

- [ ] **Step 1: Establish a compile-time RED check for the new content module**

Temporarily add this import at the top of `src/sections/FeaturedProjectSection.tsx` locally, without committing it yet:

```ts
import { geoplatformProject } from '../content/projects';
```

Run:

```bash
npx tsc --noEmit
```

Expected: FAIL because `../content/projects` does not exist yet.

Immediately remove the temporary import before continuing Task 1 so the task commit contains only the new content files.

- [ ] **Step 2: Create `src/content/types.ts`**

Use this contract:

```ts
export type SupportedLocale = 'en' | 'es';

export type ProjectStatus = 'live' | 'experimental' | 'research';

export type ProjectLocaleContent = {
  title: string;
  statusLabel: string;
  updatedLabel: string;
  summary: string;
  features: string[];
  imageAlt: string;
  imageCaption: string;
  architectureTitle: string;
};

export type ProjectArchitectureGroup = {
  key: string;
  title: Record<SupportedLocale, string>;
  items: Record<SupportedLocale, string[]>;
};

export type ProjectLinks = {
  live?: string;
  api?: string;
  source?: string;
};

export type ProjectContent = {
  slug: string;
  status: ProjectStatus;
  locale: Record<SupportedLocale, ProjectLocaleContent>;
  image: {
    src: string;
  };
  architecture: ProjectArchitectureGroup[];
  links: ProjectLinks;
};
```

Rationale locked by the spec: localized editorial content belongs to the project object; global UI labels remain in i18n JSON.

- [ ] **Step 3: Create `src/content/projects/geoplatform.ts`**

Use the current production-facing content, preserving existing URLs and image path:

```ts
import type { ProjectContent } from '../types';

export const geoplatformProject: ProjectContent = {
  slug: 'geoplatform',
  status: 'live',
  locale: {
    en: {
      title: 'GEO-PLATFORM v3.0',
      statusLabel: 'Live • Production',
      updatedLabel: 'Updated March 2026',
      summary: 'End-to-end platform for managing, analyzing, and visualizing mineral exploration data.',
      features: [
        'Normalized drillhole database',
        'FastAPI backend for analytics',
        'Real-time GeoJSON map integration',
        'Interactive exploration (React + Leaflet)',
      ],
      imageAlt: 'Drillhole spatial visualization using PostGIS and Leaflet',
      imageCaption: 'Drillhole and assay data visualized with PostGIS, Leaflet, and custom analytics.',
      architectureTitle: 'System Overview',
    },
    es: {
      title: 'GEO-PLATFORM v3.0',
      statusLabel: 'En Producción',
      updatedLabel: 'Actualizado Marzo 2026',
      summary: 'Plataforma integral para gestionar, analizar y visualizar datos de exploración mineral.',
      features: [
        'Base normalizada de datos de perforación',
        'Backend FastAPI para analítica',
        'Integración de mapas GeoJSON en tiempo real',
        'Exploración interactiva (React + Leaflet)',
      ],
      imageAlt: 'Visualización espacial de perforaciones usando PostGIS y Leaflet',
      imageCaption: 'Datos de perforación y ensayos visualizados con PostGIS, Leaflet y analítica personalizada.',
      architectureTitle: 'Resumen del Sistema',
    },
  },
  image: {
    src: 'images/map.png',
  },
  architecture: [
    {
      key: 'backend',
      title: { en: 'Backend', es: 'Backend' },
      items: {
        en: ['FastAPI (Python 3.11)', 'Connection pooling & CORS', 'Logging & analytics'],
        es: ['FastAPI (Python 3.11)', 'Connection pooling y CORS', 'Logging y analítica'],
      },
    },
    {
      key: 'frontend',
      title: { en: 'Frontend', es: 'Frontend' },
      items: {
        en: ['React + TypeScript', 'Vite build system', 'Leaflet map UI'],
        es: ['React + TypeScript', 'Sistema de build Vite', 'Interfaz de mapas Leaflet'],
      },
    },
    {
      key: 'data-layer',
      title: { en: 'Data Layer', es: 'Capa de Datos' },
      items: {
        en: ['PostgreSQL + PostGIS', 'Spatial queries', 'Normalized schema'],
        es: ['PostgreSQL + PostGIS', 'Consultas espaciales', 'Esquema normalizado'],
      },
    },
    {
      key: 'visualization',
      title: { en: 'Visualization', es: 'Visualización' },
      items: {
        en: ['React-Leaflet map', 'GeoJSON features', 'Interactive popups & charts'],
        es: ['Mapa React-Leaflet', 'Features GeoJSON', 'Popups y gráficos interactivos'],
      },
    },
  ],
  links: {
    live: 'https://sanjuangeo.vercel.app/',
    api: 'https://geo-plataform.onrender.com',
    source: 'https://github.com/juanmanueltorres-creator/Geo_Platform',
  },
};
```

Do not add unrelated metadata (`family`, `related`, `evidence`, Markdown body, etc.) in this phase.

- [ ] **Step 4: Create `src/content/projects/index.ts`**

```ts
export { geoplatformProject } from './geoplatform';
```

This creates the reusable import seam without prematurely building a registry or filtering API.

- [ ] **Step 5: Run TypeScript and build checks**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected: both PASS. The new content files are compile-time valid and do not alter the rendered application yet.

- [ ] **Step 6: Commit Task 1**

```bash
git add src/content/types.ts src/content/projects/geoplatform.ts src/content/projects/index.ts
git commit -m "feat: add typed GeoPlatform content model"
```

---

### Task 2: Migrate `FeaturedProjectSection` to consume `ProjectContent`

**Files:**
- Modify: `src/sections/FeaturedProjectSection.tsx`

**Interfaces:**
- Consumes: `geoplatformProject: ProjectContent` from `../content/projects`.
- Consumes: active i18next language via `useTranslation()`.
- Produces: unchanged `FeaturedProjectSection` React component API (no props added).

- [ ] **Step 1: Add the project import and locale selection**

Change the component setup from:

```ts
const { t } = useTranslation();
const theme = useTheme();
```

to:

```ts
import { geoplatformProject } from '../content/projects';
import type { SupportedLocale } from '../content/types';

const { t, i18n } = useTranslation();
const theme = useTheme();
const locale: SupportedLocale = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en';
const project = geoplatformProject;
const content = project.locale[locale];
```

This implements the deterministic fallback required by the spec: anything other than Spanish resolves to English.

- [ ] **Step 2: Replace title/status/summary literals with content fields**

Use:

```tsx
<Typography variant="h2" sx={{ fontWeight: 700, mb: 0.5 }}>
  {content.title}
</Typography>

<Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', mb: 0.5 }}>
  <Chip label={content.statusLabel} color="success" />
  <Chip label={content.updatedLabel} />
</Box>

<Typography
  variant="h5"
  sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', fontWeight: 400, lineHeight: 1.3, mb: 0 }}
>
  {content.summary}
</Typography>
```

Do not change the surrounding MUI `sx` values.

- [ ] **Step 3: Replace the four hardcoded feature cards with a map**

Replace the four repeated feature-card `Grid` items with:

```tsx
{content.features.map(feature => (
  <Grid item xs={12} sm={6} md={3} key={feature}>
    <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}>
      <CardContent
        sx={{
          p: { xs: 3, md: 4 },
          minHeight: 90,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontWeight: 500, textAlign: 'center', fontSize: { xs: '1rem', md: '1.08rem' } }}>
          {feature}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
))}
```

Preserve the existing Grid container spacing and layout.

- [ ] **Step 4: Move image metadata to the content object**

Change:

```tsx
src={`${(import.meta as any).env.BASE_URL}images/map.png`}
alt="Drillhole spatial visualization using PostGIS and Leaflet"
```

to:

```tsx
src={`${(import.meta as any).env.BASE_URL}${project.image.src}`}
alt={content.imageAlt}
```

Change the caption body to:

```tsx
{content.imageCaption}
```

Do not change image styling or dimensions.

- [ ] **Step 5: Replace the four hardcoded architecture cards with a map**

Keep the existing heading component/styling, but render:

```tsx
<Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
  {content.architectureTitle}
</Typography>

<Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
  {project.architecture.map(group => (
    <Grid item xs={12} sm={6} md={3} key={group.key}>
      <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}>
        <CardContent sx={{ p: { xs: 3, md: 4 } }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {group.title[locale]}
          </Typography>
          <List dense>
            {group.items[locale].map(item => (
              <ListItem disableGutters key={item}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>
```

Do not introduce a new card component in this phase; keeping rendering local limits the refactor surface.

- [ ] **Step 6: Make action buttons consume project links without changing labels**

Keep the global button labels in `react-i18next`:

```tsx
{project.links.live && (
  <Button
    variant="contained"
    href={project.links.live}
    target="_blank"
    size="large"
    sx={{ fontWeight: 600 }}
  >
    {t('featured.btnLiveDemo')}
  </Button>
)}

{project.links.api && (
  <Button variant="outlined" href={project.links.api} target="_blank" size="large">
    {t('featured.btnAPI')}
  </Button>
)}

{project.links.source && (
  <Button variant="outlined" href={project.links.source} target="_blank" size="large">
    {t('featured.btnCode')}
  </Button>
)}
```

This implements the optional-link safety rule while preserving all three GeoPlatform buttons.

- [ ] **Step 7: Run compile/build verification**

Run:

```bash
npx tsc --noEmit
npm run build
```

Expected: PASS.

- [ ] **Step 8: Run the app for manual visual/i18n verification**

Run:

```bash
npm run dev
```

Verify in the browser:

1. Featured GeoPlatform section layout is visually equivalent to the pre-change version.
2. Dark/light theme behavior is unchanged.
3. English renders title/status/summary/features/caption/architecture in English.
4. Spanish renders the migrated project content in Spanish.
5. `Explore Live` / `Explorar en Vivo` points to `https://sanjuangeo.vercel.app/`.
6. API button points to `https://geo-plataform.onrender.com`.
7. Source button points to `https://github.com/juanmanueltorres-creator/Geo_Platform`.
8. Map image still loads.
9. Check one desktop width and one narrow/mobile width for obvious regressions.

- [ ] **Step 9: Commit Task 2**

```bash
git add src/sections/FeaturedProjectSection.tsx
git commit -m "refactor: render GeoPlatform from typed content"
```

---

### Task 3: Complete the i18n boundary cleanup

**Files:**
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/es.json`

**Interfaces:**
- Keeps: `featured.btnLiveDemo`, `featured.btnAPI`, `featured.btnCode` for generic UI actions.
- Removes migrated project-editorial keys that `FeaturedProjectSection.tsx` no longer consumes.

- [ ] **Step 1: Confirm the moved keys are no longer referenced**

Run:

```bash
git grep "featured\.title\|featured\.statusLive\|featured\.statusUpdated\|featured\.stackTitle"
```

Expected: matches only in `src/i18n/en.json` and `src/i18n/es.json`; there should be no component references after Task 2.

If a component reference remains, stop and fix Task 2 before deleting translation keys.

- [ ] **Step 2: Remove only the migrated editorial keys from both locale files**

Delete these keys from `featured` in both `src/i18n/en.json` and `src/i18n/es.json`:

```text
title
statusLive
statusUpdated
stackTitle
```

Keep:

```text
btnLiveDemo
btnAPI
btnCode
```

Do not clean unrelated stale `featured.*` keys in this phase; that would expand scope.

- [ ] **Step 3: Validate JSON, TypeScript, and production build**

Run:

```bash
node -e "JSON.parse(require('fs').readFileSync('src/i18n/en.json','utf8')); JSON.parse(require('fs').readFileSync('src/i18n/es.json','utf8')); console.log('i18n JSON OK')"
npx tsc --noEmit
npm run build
```

Expected:

```text
i18n JSON OK
```

and TypeScript/build both PASS.

- [ ] **Step 4: Run a final source-boundary check**

Run:

```bash
git grep "GEO-PLATFORM v3.0\|Normalized drillhole database\|Base normalizada de datos de perforación\|geo-plataform.onrender.com"
```

Expected: GeoPlatform editorial/project values are centralized in `src/content/projects/geoplatform.ts`, except generic references in docs/spec/plan files.

- [ ] **Step 5: Commit Task 3**

```bash
git add src/i18n/en.json src/i18n/es.json
git commit -m "refactor: separate project content from site i18n"
```

---

### Task 4: Final regression verification and branch readiness

**Files:**
- No production file changes expected.
- Modify the plan only if verification reveals a documented deviation that must be recorded before review.

**Interfaces:**
- Validates the complete phase against the design spec.

- [ ] **Step 1: Verify branch diff stays inside approved scope**

Run:

```bash
git diff main...HEAD -- src package.json package-lock.json vite.config.*
```

Expected production changes are limited to:

```text
src/content/types.ts
src/content/projects/geoplatform.ts
src/content/projects/index.ts
src/sections/FeaturedProjectSection.tsx
src/i18n/en.json
src/i18n/es.json
```

`package.json`, `package-lock.json`, Vite configuration, `App.tsx`, and `OtherProjectsSection.tsx` must be unchanged.

- [ ] **Step 2: Run final compile/build gates from a clean working tree**

Run:

```bash
git status --short
npx tsc --noEmit
npm run build
```

Expected:

```text
# git status --short prints nothing
# tsc exits 0
# vite build exits 0
```

- [ ] **Step 3: Repeat final manual smoke test**

With `npm run dev`, verify:

- EN/ES switch changes migrated GeoPlatform editorial content.
- Theme switch still works.
- Three action links are unchanged.
- Image loads.
- Desktop and narrow viewport remain visually equivalent.
- Section order is unchanged.

- [ ] **Step 4: Review commit history**

Run:

```bash
git log --oneline --decorate -6
```

Expected implementation commits after the design/plan commits:

```text
refactor: separate project content from site i18n
refactor: render GeoPlatform from typed content
feat: add typed GeoPlatform content model
```

No squash is required before review; the small commits make rollback and review easier.

- [ ] **Step 5: Push the completed branch**

```bash
git push origin feat/content-driven-portfolio
```

Do not merge to `main` until the final diff and live preview/review are accepted.
