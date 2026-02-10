"use client";

import {
  Tabs as ShadcnTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TabsProps {
  items: string[];
  defaultValue?: string;
  children: React.ReactNode;
}

export function Tabs({ items, defaultValue, children }: TabsProps) {
  return (
    <ShadcnTabs defaultValue={defaultValue || items[0]} className="my-6">
      <TabsList>
        {items.map((item) => (
          <TabsTrigger key={item} value={item}>
            {item}
          </TabsTrigger>
        ))}
      </TabsList>
      {children}
    </ShadcnTabs>
  );
}

interface TabProps {
  value: string;
  children: React.ReactNode;
}

export function Tab({ value, children }: TabProps) {
  return <TabsContent value={value}>{children}</TabsContent>;
}
