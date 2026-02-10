export interface NavLink {
  title: string;
  href: string;
  external?: boolean;
}

export interface SocialLink {
  platform: "github" | "twitter" | "discord";
  url: string;
}

export interface DoculiteConfig {
  name: string;
  description: string;
  url?: string;
  navLinks: NavLink[];
  socialLinks?: SocialLink[];
  footer?: {
    text?: string;
  };
  github?: {
    repo?: string;
    editUrl?: string; // Base URL for "Edit this page" links
  };
}
