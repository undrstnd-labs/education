import { getCurrentUser } from "@lib/session";

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
