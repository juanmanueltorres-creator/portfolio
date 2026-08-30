# Content-Driven Portfolio Foundation — Design

Date: 2026-08-30
Branch: `feat/content-driven-portfolio`
Status: Proposed / awaiting implementation approval

## 1. Objective

Introduce a minimal, typed content layer for portfolio projects without changing the current visual design, routing model, deployment model, or public behavior.

The first migration target is **GeoPlatform only**.

The architectural goal is to separate project content from React presentation so that future projects can be added and maintained as structured content rather than by editing large UI components.

## 2. Current State

The portfolio is a React 18 + TypeScript + Vite application using MUI and `react-i18next`.

The main page is currently composed linearly in `src/App.tsx` from sections such as:

- `HeroSection`
- `SkillsSection`
- `FeaturedProjectSection`
- `OtherProjectsSection`
- `ExpertiseSection`
- `ContactSection`

There is no project router or content registry today.

`FeaturedProjectSection.tsx` currently mixes:

- UI layout and MUI styling;
- GeoPlatform copy;
- feature descriptions;
- architecture/stack descriptions;
- image metadata;
- live/API/source URLs.

Some GeoPlatform strings already exist in `src/i18n/en.json` and `src/i18n/es.json`, while other strings are hardcoded directly in English inside the component. This split must not be made worse during the migration.

## 3. Constraints

This first phase MUST:

- preserve the existing visual appearance as closely as practical;
- preserve the current `App.tsx` composition;
- preserve English/Spanish language switching;
- preserve existing public links and images;
- avoid new runtime dependencies;
- avoid changing Vite configuration;
- avoid introducing a CMS, database, backend, router, Markdown parser, or MDX tooling;
- avoid refactoring unrelated sections;
- remain compatible with the current Vercel/static build flow;
- pass `npm run build` before completion.

## 4. Recommended Architecture

Use a small TypeScript content layer under `src/content/`.

```text
src/
├── content/
│   ├── types.ts
│   └── projects/
│       ├── geoplatform.ts
│       └── index.ts
├── sections/
│   └── FeaturedProjectSection.tsx
└── i18n/
```

The content layer owns project data. The React section owns rendering and styling.

Data flow:

```text
geoplatform.ts
    ↓
ProjectContent contract
    ↓
FeaturedProjectSection.tsx
    ↓
existing MUI UI
```

## 5. Content Contract

Start with the smallest contract required by the existing GeoPlatform section.

Conceptual shape:

```ts
export type SupportedLocale = 'en' | 'es';

export type ProjectStatus = 'live' | 'experimental' | 'research';

export type ProjectLocaleContent = {
  title: string;
  statusLabel: string;
  updatedLabel: string;
  summary: string;
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
  features: Record<SupportedLocale, string[]>;
  image: {
    src: string;
    alt: Record<SupportedLocale, string>;
  };
  architecture: ProjectArchitectureGroup[];
  links: ProjectLinks;
};
```

The exact field names may be adjusted during implementation if the existing component reveals a smaller or clearer shape, but the responsibilities must remain the same.

## 6. Internationalization Strategy

For this phase, project-specific editorial content moves into the project content object with explicit `en` and `es` variants.

Global UI language such as navigation, generic buttons, contact labels, and other site-wide strings remains in `react-i18next`.

This creates a deliberate boundary:

```text
site-wide UI language
→ i18n JSON

project editorial content
→ ProjectContent
```

The implementation must read the active language from `i18next` and select the corresponding project locale. It must fall back safely to English if an unexpected locale is encountered.

No global i18n rewrite is part of this phase.

## 7. First Migration: GeoPlatform

Create `src/content/projects/geoplatform.ts` containing the data currently embedded in `FeaturedProjectSection.tsx` and the GeoPlatform-specific strings currently split across translation JSON.

The migration should include only content required by the section currently visible in production:

- title;
- status labels;
- summary;
- four feature cards;
- image path and alt/caption;
- four architecture groups;
- live/API/source URLs;
- localized labels required to preserve the current EN/ES experience.

`FeaturedProjectSection.tsx` should remain responsible for:

- section layout;
- MUI components;
- responsive behavior;
- colors;
- spacing;
- cards;
- buttons;
- image rendering;
- theme behavior.

It should no longer own GeoPlatform business/editorial content.

## 8. Out of Scope

The following are explicitly NOT part of this implementation:

- redesigning the homepage;
- adopting the Felipe Santibanez visual style;
- Markdown or MDX;
- Jekyll or AcademicPages;
- project detail pages;
- React Router;
- `Lab Notes` / `Rolling`;
- project families/taxonomy UI;
- migrating `OtherProjectsSection`;
- adding Pulso, FleetFlow, Atlas Geotech, Anti IA, Rally Stage Sim, or other new cards;
- changing deployment ownership or domains;
- refactoring theme, navbar, contact form, skills, or footer;
- changing existing public endpoints or application URLs.

## 9. Error Handling and Safe Defaults

The content layer is compile-time TypeScript data, so malformed project shapes should fail TypeScript/build validation rather than fail silently at runtime.

Runtime locale selection must use a deterministic fallback:

```text
requested locale exists → use it
otherwise → English
```

Optional links should only render corresponding buttons when the URL exists. For GeoPlatform in phase 1, all currently existing links should remain present.

No remote content fetch is introduced, eliminating network failure modes for portfolio content.

## 10. Testing and Verification

Minimum verification before calling the phase complete:

1. Run `npm run build` successfully.
2. Run the app locally with `npm run dev` and manually verify the featured GeoPlatform section.
3. Verify English mode.
4. Verify Spanish mode.
5. Verify all GeoPlatform action buttons point to the same destinations as before.
6. Verify the image loads from the same asset path.
7. Verify desktop and a narrow/mobile viewport for obvious layout regressions.
8. Confirm `App.tsx` behavior and section order are unchanged.
9. Confirm no unrelated section was refactored.

If the repository has no automated test framework for this UI, phase 1 does not introduce one solely for this migration.

## 11. Acceptance Criteria

The phase is accepted when:

- GeoPlatform appears visually equivalent to the pre-change version;
- English/Spanish behavior still works;
- `FeaturedProjectSection.tsx` consumes a typed GeoPlatform content object instead of owning project copy, links, feature data, and architecture data;
- no new dependency is required;
- `npm run build` passes;
- no unrelated portfolio section changes behavior;
- the migration provides a clear reusable seam for a second project without forcing a full-site refactor.

## 12. Follow-Up Direction

Only after phase 1 is proven should the content model be exercised with additional projects.

Recommended sequence:

```text
GeoPlatform
→ validate content contract
→ migrate one secondary project
→ refine reusable project renderer
→ migrate remaining selected projects incrementally
→ introduce project families
→ consider project detail pages / Lab Notes
→ consider Markdown/MDX only if editorial authoring becomes painful
```

The TypeScript content contract is intentionally an implementation boundary, not a permanent storage-format commitment. A later Markdown/MDX source can replace the internal storage format without requiring presentation components to change if the contract remains stable.

## 13. Architectural Principle

> Change where the content lives before changing how the portfolio looks.

This phase is successful if it makes the portfolio easier to evolve while producing almost no visible change for the user.
