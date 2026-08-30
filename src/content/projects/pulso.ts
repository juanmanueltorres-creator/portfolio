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
