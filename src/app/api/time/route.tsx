import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const currentUser = await getCurrentUser();

  const timeEntries = await prisma.timeEntry.findMany({
    where: {
      project: {
        userId: currentUser.id,
      },
    },
    include: {
      project: true,
    },
  });

  return new Response(JSON.stringify(timeEntries), {
    headers: { "Content-Type": "application/json" },
  });
}
