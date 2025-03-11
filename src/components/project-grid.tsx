import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import ProjectCard from "./project-card";

export async function ProjectGrid() {
  const user = await getCurrentUser();
  const projects = await prisma.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (projects.length === 0) {
    return (
      <article className="message">
        <div className="message-body">
          You have no projects yet. <Link href="/projects/create">Create</Link>{" "}
          one to get started!
        </div>
      </article>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
