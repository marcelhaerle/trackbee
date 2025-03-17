"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function saveTimeEntryHandler(formData: FormData) {
  const id = formData.get("id") as string;
  const description = formData.get("description") as string;
  const startTime = new Date(formData.get("startTime") as string);
  const endTime = new Date(formData.get("endTime") as string);
  const projectId = formData.get("projectId") as string;

  await prisma.timeEntry.update({
    where: {
      id,
    },
    data: {
      description,
      startTime,
      endTime,
      projectId,
    },
  });

  return redirect("/dashboard");
}
