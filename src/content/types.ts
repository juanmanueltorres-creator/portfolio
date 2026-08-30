export type SupportedLocale = 'en' | 'es';

export type ProjectStatus = 'live' | 'experimental' | 'research';

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
  image?: {
    src: string;
  };
  architecture?: ProjectArchitectureGroup[];
  links: ProjectLinks;
};
