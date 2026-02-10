"use client";

import { useTranslations } from "next-intl";
import { LOCALE_LABELS, type Locale } from "@/lib/i18n-config";
import { Info } from "lucide-react";

export function FallbackBanner({ locale }: { locale: Locale }) {
  const t = useTranslations("i18n");

  return (
    <div className="mb-6 flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
      <Info className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{t("untranslatedBanner", { language: LOCALE_LABELS[locale] })}</p>
    </div>
  );
}
