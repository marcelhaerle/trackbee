import { ProjectGrid } from "@/components/project-grid";
import { getCurrentUser } from "@/lib/session";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <section className="section">
      <h1 className="title">Dashboard</h1>
      <p>Welcome, {user.name}!</p>
      <ProjectGrid />
    </section>
  );
}
