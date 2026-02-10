export interface NavItem {
  title: string;
  href: string;
  order: number;
}

export interface NavGroup {
  title: string;
  order: number;
  items: NavEntry[];
}

export type NavEntry = NavItem | NavGroup;
export type NavTree = NavEntry[];

// Type guard to distinguish groups from items
export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "items" in entry;
}
