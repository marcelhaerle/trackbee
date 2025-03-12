import Dashboard from "@/components/dashboard";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <section className="section">
      <h1 className="title">Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <Dashboard />
    </section>
  );
}
