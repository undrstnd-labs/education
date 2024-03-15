export interface NavItem {
  title: string;
  href: string;
  disabled?: boolean;
}

export type MainNavItem = NavItem;

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
  };
}

export interface MarketingConfig {
  mainNav: MainNavItem[];
}

export type TranslationFunction = (key: string) => string;

export type EmailOption = {
  label: string;
  abbrev: string;
  value: string;
  avatarUrl: string;
};
