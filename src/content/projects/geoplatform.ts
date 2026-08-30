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
