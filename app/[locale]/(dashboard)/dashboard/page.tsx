import { getCurrentUser } from "@lib/session";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("Metadata.Pages.Dashboard");
  return { title: `${t("title")}` };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>
    </div>
  );
}
