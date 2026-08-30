# Pulso Content Migration Design

## Goal

Migrate Pulso Público Argentina into the portfolio's typed project-content system as the second real project, replacing the stale Google Earth Engine card without redesigning the portfolio.

## Why this migration matters

GeoPlatform proved that project-specific copy can move out of a section component and into `ProjectContent`. Pulso is deliberately different: it does not need the large featured-project presentation, does not currently have a portfolio image asset, and does not need an architecture grid in the compact card. This migration therefore tests whether the content contract is reusable rather than GeoPlatform-specific.

## Scope

### In scope

- Create a typed Pulso content object in `src/content/projects/pulso.ts`.
- Export Pulso from `src/content/projects/index.ts`.
- Generalize `ProjectContent` only as much as required so projects may omit an image and architecture groups.
- Replace the stale Google Earth Engine card in `OtherProjectsSection.tsx` with Pulso.
- Keep the existing card layout and visual styling.
- Preserve the existing Insight Laboratory card unchanged.
- Support both English and Spanish project copy through the same locale resolution pattern already used by GeoPlatform.
- Link Pulso to its live GitHub Pages site and public repository.

### Out of scope

- No router or project detail pages.
- No new portfolio navigation.
- No redesign of `OtherProjectsSection`.
- No migration of Insight Laboratory in this phase.
- No new screenshot or image asset for Pulso.
- No Markdown/MDX conversion.
- No change to Vercel or GitHub Pages deployment configuration.
- No refactor of unrelated i18n keys or sections.

## Source of truth for Pulso copy

Pulso's current repository and README are the factual source. Portfolio copy must stay faithful to the live product and its evidence-first positioning:

- public territorial signals and evidence;
- national signals plus spatial signals;
- traceable provenance, time, method, and limitations;
- MapLibre-based territorial interface;
- official/public sources including CAMMESA, OpenAlex, INPI, GeoRef, INPRES, CONAE, IGN, Open-Meteo/ECMWF and AgroENSO references;
- no claim should imply that Pulso turns associations or thermal anomalies into diagnoses, forecasts, or authoritative conclusions.

The compact portfolio card should summarize the product rather than reproduce the README.

## Content contract change

The current contract requires every project to provide:

- `image`
- `architecture`
- locale strings `imageAlt`, `imageCaption`, and `architectureTitle`

That is unnecessarily coupled to the GeoPlatform renderer. The minimum generalization is:

```ts
export type ProjectLocaleContent = {
  title: string;
  statusLabel: string;
  updatedLabel: string;
  summary: string;
  features: string[];
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

GeoPlatform keeps all existing fields, so its renderer and visual output remain unchanged. Any renderer that uses optional fields must guard them before rendering.

## Pulso content shape

Pulso will use:

- `slug: 'pulso-publico-argentina'`
- `status: 'live'`
- English and Spanish title/status/summary/features
- no `image`
- no `architecture`
- `links.live = 'https://juanmanueltorres-creator.github.io/pulso-publico-argentina/'`
- `links.source = 'https://github.com/juanmanueltorres-creator/pulso-publico-argentina'`

The compact feature set should communicate four things:

1. national public signals;
2. territorial signals such as earthquakes, thermal hotspots and modeled weather context;
3. explicit provenance / freshness / limitations;
4. reusable public JSON contracts and evidence snapshots.

## Renderer behavior

`OtherProjectsSection.tsx` will keep its current two-column card grid. The first card will stop owning Google Earth Engine copy and will instead read from `pulsoProject`.

The card should render:

- localized Pulso title;
- localized status/update line;
- localized summary;
- localized feature bullets;
- a compact tech/context line derived from Pulso content rather than hardcoded GEE text;
- live-site button when `links.live` exists;
- source button when `links.source` exists.

The second Insight Laboratory card is deliberately untouched.

## Locale handling

Use the same existing resolution rule as the featured section:

```ts
const locale: SupportedLocale = i18n.language.toLowerCase().startsWith('es') ? 'es' : 'en';
```

This preserves `es`, `es-AR`, and English fallback behavior without adding a new locale system.

## Testing and verification

Because the portfolio currently has no automated test suite, verification for this phase is:

1. `npx tsc --noEmit`
2. `npm run build -- --base=/portfolio/`
3. confirm generated `dist/index.html` still contains `/portfolio/assets/`
4. run the app locally and inspect both EN and ES
5. confirm GeoPlatform still renders correctly
6. confirm Pulso replaces only the old GEE card
7. confirm Insight Laboratory is unchanged
8. confirm live/source links point to the current Pulso repository and deployed site

## Success criteria

The migration is complete when Pulso is rendered from typed project content in the old GEE card position, GeoPlatform remains visually unchanged, Insight Laboratory remains unchanged, TypeScript passes, the GitHub Pages build passes with the repository base path, and no unrelated files are modified.
