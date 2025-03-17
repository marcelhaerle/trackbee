import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TimeEntryEditForm from "@/components/time-entry-edit-form";

export default async function EntryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const timeEntry = await prisma.timeEntry.findFirst({
    where: {
      id: id,
    },
  });

  if (!timeEntry) {
    redirect("/dashboard");
  }

  return (
    <section className="section">
      <TimeEntryEditForm timeEntry={timeEntry} />
    </section>
  );
}
