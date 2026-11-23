import { redirect } from "next/navigation";

import { DEFAULT_LANG } from "@/i18n/locales";
import { localizedPath } from "@/lib/i18n/routing";

export default function RootPage() {
  redirect(localizedPath(DEFAULT_LANG, "/"));
}