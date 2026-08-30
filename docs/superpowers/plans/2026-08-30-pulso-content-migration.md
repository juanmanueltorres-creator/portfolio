# Pulso Content Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render Pulso Público Argentina from the portfolio's typed project-content system in the former Google Earth Engine card position, while keeping GeoPlatform and Insight Laboratory visually unchanged.

**Architecture:** Generalize `ProjectContent` only where the second project proves the current contract is too GeoPlatform-specific: image, architecture, their localized labels, and a compact localized `metaLine` become optional. GeoPlatform keeps its complete content and the featured renderer narrows optional fields before rendering; Pulso uses the same content contract with no image or architecture and is consumed by the existing compact card renderer.

**Tech Stack:** React 18, TypeScript 5.2 strict mode, Vite 5, Material UI 5, react-i18next, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-08-30-pulso-content-migration-design.md`

## Global Constraints

- Do not redesign the portfolio.
- Pulso replaces only the stale Google Earth Engine card.
- Preserve the Insight Laboratory card unchanged.
- Preserve GeoPlatform's current visible output.
- Do not add an image or architecture block to Pulso merely to satisfy the type.
- Do not add a router, Markdown/MDX, CMS, dependency, backend, or deployment change.
- Keep project-specific copy in typed content; keep generic UI button labels in the existing i18n layer.
- Use Pulso's current README as the factual source and preserve its evidence-first limitations.
- Final GitHub Pages verification must build with `--base=/portfolio/`.

---

### Task 1: Generalize the project contract without changing GeoPlatform output

**Files:**
- Modify: `src/content/types.ts`
- Modify: `src/sections/FeaturedProjectSection.tsx`

**Interfaces:**
- Consumes: existing `ProjectContent`, `ProjectLocaleContent`, and `geoplatformProject`.
- Produces: `ProjectLocaleContent.metaLine?: string`, optional image/architecture presentation fields, and a featured renderer that safely narrows them.

- [ ] **Step 1: Make only the proven presentation fields optional**

Replace the relevant type declarations in `src/content/types.ts` with:

```ts
export type ProjectLocaleContent = {
  title: string;
  statusLabel: string;
  updatedLabel: string;
  summary: string;
  features: string[];
  metaLine?: string;
  imageAlt?: string;
  imageCaption?: string;
  architectureTitle?: string;
};

export type ProjectContent = {
  slug: string;
  status: ProjectStatus;
  locale: Record<SupportedLocale, ProjectLocaleContent>;
  image?: {
    src: string;
  };
  architecture?: ProjectArchitectureGroup[];
  links: ProjectLinks;
};
```

Do not change `ProjectStatus`, `ProjectArchitectureGroup`, or `ProjectLinks`.

- [ ] **Step 2: Run the strict compiler and verify the expected RED state**

Run:

```bash
npx tsc --noEmit
```

Expected: FAIL in `FeaturedProjectSection.tsx` because `project.image` and/or `project.architecture` may now be `undefined`. This failure proves the current featured renderer depended on GeoPlatform-only requirements.

- [ ] **Step 3: Narrow optional fields in the featured renderer**

After:

```ts
const content = project.locale[locale];
```

add:

```ts
const image = project.image;
const architecture = project.architecture;
```

Wrap the existing image block without changing its inner styling:

```tsx
{image && content.imageAlt && content.imageCaption && (
  <Box
    sx={{
      maxWidth: 460,
      mx: 'auto',
      mb: { xs: 4, md: 6 },
      mt: { xs: 4, md: 7 },
    }}
  >
    <Box
      sx={{
        position: 'relative',
        minHeight: { xs: 200, sm: 250, md: 310 },
        borderRadius: 4,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(180deg, rgba(20, 27, 40, 0.96), rgba(11, 16, 26, 0.98))'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(244, 247, 251, 0.98))',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 24px 60px rgba(0, 0, 0, 0.3)'
            : '0 20px 45px rgba(15, 23, 42, 0.12)',
        '&:hover img': {
          transform: 'scale(1.02)',
        },
      }}
    >
      <Box
        component="img"
        src={`${(import.meta as any).env.BASE_URL}${image.src}`}
        alt={content.imageAlt}
        sx={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'cover',
          objectPosition: 'center 35%',
          transition: 'transform 0.35s ease',
        }}
      />
    </Box>
    <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic', textAlign: 'center', mt: 2 }}>
      {content.imageCaption}
    </Typography>
  </Box>
)}
```

Wrap the existing architecture block without changing its card styling:

```tsx
{architecture && content.architectureTitle && (
  <Box sx={{ mb: { xs: 2, md: 3 } }}>
    <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
      {content.architectureTitle}
    </Typography>
    <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center">
      {architecture.map((group) => (
        <Grid item xs={12} sm={6} md={3} key={group.key}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: '100%' }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {group.title[locale]}
              </Typography>
              <List dense>
                {group.items[locale].map((item) => (
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
  </Box>
)}
```

For the current `geoplatformProject`, every condition is true, so rendered content and styling remain the same.

- [ ] **Step 4: Verify GREEN TypeScript and production build**

Run:

```bash
npx tsc --noEmit
npm run build -- --base=/portfolio/
```

Expected: both PASS. The Vite chunk-size warning may remain; it is non-blocking and out of scope.

- [ ] **Step 5: Commit the reusable contract**

```bash
git add src/content/types.ts src/sections/FeaturedProjectSection.tsx
git commit -m "refactor: generalize project presentation contract"
```

---

### Task 2: Add Pulso as typed project content

**Files:**
- Create: `src/content/projects/pulso.ts`
- Modify: `src/content/projects/index.ts`

**Interfaces:**
- Consumes: generalized `ProjectContent` from Task 1.
- Produces: exported `pulsoProject: ProjectContent` for compact-card rendering.

- [ ] **Step 1: Create the Pulso content object**

Create `src/content/projects/pulso.ts` with:

```ts
import type { ProjectContent } from '../types';

export const pulsoProject: ProjectContent = {
  slug: 'pulso-publico-argentina',
  status: 'live',
  locale: {
    en: {
      title: 'Pulso Público Argentina',
      statusLabel: 'Live · Public',
      updatedLabel: 'V3.1',
      summary:
        'Evidence-first interface for reading public signals across Argentina without losing source, time, method, or limitations.',
      features: [
        'National signals built from public and open data sources',
        'Earthquakes, thermal hotspots, and modeled weather context',
        'Explicit provenance, freshness, method, and limitations',
        'Reusable public JSON contracts and evidence snapshots',
      ],
      metaLine: 'React · TypeScript · MapLibre · Public JSON snapshots',
    },
    es: {
      title: 'Pulso Público Argentina',
      statusLabel: 'En vivo · Público',
      updatedLabel: 'V3.1',
      summary:
        'Interfaz centrada en evidencia para leer señales públicas de Argentina sin perder fuente, tiempo, método ni limitaciones.',
      features: [
        'Señales nacionales construidas desde fuentes públicas y abiertas',
        'Sismos, focos térmicos y contexto meteorológico modelado',
        'Procedencia, frescura, método y limitaciones explícitas',
        'Contratos JSON públicos y snapshots de evidencia reutilizables',
      ],
      metaLine: 'React · TypeScript · MapLibre · Snapshots JSON públicos',
    },
  },
  links: {
    live: 'https://juanmanueltorres-creator.github.io/pulso-publico-argentina/',
    source: 'https://github.com/juanmanueltorres-creator/pulso-publico-argentina',
  },
};
```

Do not add `image`, `architecture`, or `api`.

- [ ] **Step 2: Export Pulso beside GeoPlatform**

Update `src/content/projects/index.ts` to:

```ts
export { geoplatformProject } from './geoplatform';
export { pulsoProject } from './pulso';
```

- [ ] **Step 3: Verify the content object satisfies the strict contract**

Run:

```bash
npx tsc --noEmit
```

Expected: PASS with no output.

- [ ] **Step 4: Commit Pulso content**

```bash
git add src/content/projects/pulso.ts src/content/projects/index.ts
git commit -m "feat: add Pulso project content"
```

---

### Task 3: Replace the stale GEE card with Pulso content

**Files:**
- Modify: `src/sections/OtherProjectsSection.tsx`

**Interfaces:**
- Consumes: `pulsoProject`, `SupportedLocale`, existing `featured.btnLiveDemo` and `featured.btnCode` global i18n labels.
- Produces: the first compact project card rendered from Pulso content while the second Insight Laboratory card remains byte-for-byte unchanged where practical.

- [ ] **Step 1: Add typed Pulso imports and locale resolution**

Add imports:

```ts
import { pulsoProject } from '../content/projects';
import type { SupportedLocale } from '../content/types';
```

Change:

```ts
const { t } = useTranslation();
```

to:

```ts
const { t, i18n } = useTranslation();
```

Then after `const theme = useTheme();` add:

```ts
const locale: SupportedLocale = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en';
const pulso = pulsoProject;
const pulsoContent = pulso.locale[locale];
```

- [ ] **Step 2: Replace only the first Grid card**

Keep the current first-card `Card`, `CardContent`, spacing, hover, and typography styling. Replace its GEE-specific content with:

```tsx
<Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
  {pulsoContent.title}
</Typography>
<Typography color="text.secondary" sx={{ mb: 2, fontSize: '1.05rem', minHeight: 44 }}>
  {pulsoContent.statusLabel} · {pulsoContent.updatedLabel}
</Typography>
<Typography sx={{ mb: 2, fontSize: '1rem', minHeight: 44 }}>
  {pulsoContent.summary}
</Typography>
<ul style={{ margin: 0, paddingLeft: 18, marginBottom: 12 }}>
  {pulsoContent.features.map((feature) => (
    <li key={feature}>
      <Typography>{feature}</Typography>
    </li>
  ))}
</ul>
{pulsoContent.metaLine && (
  <Typography color="text.secondary" sx={{ fontSize: '0.95rem', mt: 'auto' }}>
    {pulsoContent.metaLine}
  </Typography>
)}
```

Replace the first card actions with:

```tsx
<CardActions sx={{ px: { xs: 3, md: 5 }, pb: 2, gap: 1, flexWrap: 'wrap' }}>
  {pulso.links.live && (
    <Button size="small" href={pulso.links.live} target="_blank">
      {t('featured.btnLiveDemo')}
    </Button>
  )}
  {pulso.links.source && (
    <Button size="small" href={pulso.links.source} target="_blank">
      {t('featured.btnCode')}
    </Button>
  )}
</CardActions>
```

Do not alter the second `InsightLab Portfolio` `<Grid item>` block.

- [ ] **Step 3: Verify TypeScript and the GitHub Pages build**

Run:

```bash
npx tsc --noEmit
npm run build -- --base=/portfolio/
```

Expected: PASS.

- [ ] **Step 4: Verify the Pages base path was preserved**

PowerShell:

```powershell
Select-String -Path dist\index.html -Pattern "/portfolio/assets/"
```

Expected: script and stylesheet paths both begin with `/portfolio/assets/`.

- [ ] **Step 5: Commit the compact renderer migration**

```bash
git add src/sections/OtherProjectsSection.tsx
git commit -m "refactor: render Pulso in projects section"
```

---

### Task 4: Regression review before integration

**Files:**
- Review only; no production file should need modification if Tasks 1-3 are correct.

**Interfaces:**
- Consumes: complete branch implementation.
- Produces: verified branch ready for merge/PR decision.

- [ ] **Step 1: Confirm the branch contains only expected changes**

Run:

```bash
git status
git diff --check main...HEAD
git diff --name-only main...HEAD
```

Expected production changes:

```text
src/content/projects/index.ts
src/content/projects/pulso.ts
src/content/types.ts
src/sections/FeaturedProjectSection.tsx
src/sections/OtherProjectsSection.tsx
```

Expected documentation changes:

```text
docs/superpowers/specs/2026-08-30-pulso-content-migration-design.md
docs/superpowers/plans/2026-08-30-pulso-content-migration.md
```

No i18n JSON, deployment workflow, Vite config, package, theme, router, or InsightLab asset changes should appear.

- [ ] **Step 2: Run the final technical gates on the exact tree being integrated**

```bash
npx tsc --noEmit
npm run build -- --base=/portfolio/
```

Expected: PASS.

- [ ] **Step 3: Run local visual regression**

```bash
npm run dev
```

Inspect both locales and verify:

- GeoPlatform title, feature cards, image, architecture cards, and links still appear as before.
- Pulso occupies the former Google Earth Engine card position.
- English Pulso copy appears under EN.
- Spanish Pulso copy appears under ES / `es-AR`.
- Pulso live button opens `https://juanmanueltorres-creator.github.io/pulso-publico-argentina/`.
- Pulso source button opens `https://github.com/juanmanueltorres-creator/pulso-publico-argentina`.
- Insight Laboratory card remains visually and textually unchanged.

- [ ] **Step 4: Integration decision**

After all gates are green, use the finishing-a-development-branch workflow. Do not merge or delete the branch automatically; present the integration options to the user.
