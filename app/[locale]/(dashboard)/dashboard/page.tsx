import { getCurrentUser } from "@lib/session";

// TODO: Generate metadata from the translation file
export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  return (
    <div>
      <pre>
        <code>{JSON.stringify(user, null, 2)}</code>
      </pre>{" "}
    </div>
  );
}
