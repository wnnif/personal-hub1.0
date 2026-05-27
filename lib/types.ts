export type ThemeMode = "system" | "light" | "dark";

export type Profile = {
  name: string;
  bio: string;
  avatarUrl: string;
  footerText: string;
};

export type SiteSettings = {
  siteTitle: string;
  seoDescription: string;
  defaultTheme: ThemeMode;
  analyticsId: string;
};

export type SearchEngine = {
  name: string;
  icon: string;
  url: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
};

export type PortalLink = {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: string;
  categoryId: string;
  categoryName: string;
  sortOrder: number;
  isActive: boolean;
};

export type SocialLink = {
  id: string;
  label: string;
  icon: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
};

export type FeaturedLink = {
  id: string;
  label: string;
  icon: string;
  hint: string;
  url: string;
  sortOrder: number;
  isActive: boolean;
};

export type PortalDataset = {
  profile: Profile;
  settings: SiteSettings;
  searchEngines: SearchEngine[];
  categories: Category[];
  links: PortalLink[];
  socials: SocialLink[];
  featuredLinks: FeaturedLink[];
};
