import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const session = await auth();

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const user = await getCurrentUser();

  const currentTracking = await prisma.currentTrack.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      project: true,
    },
  });

  if (!currentTracking) {
    return new NextResponse(null, {
      status: 204,
    });
  }

  return new NextResponse(JSON.stringify(currentTracking), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const body = await request.json();
  const id = body.id;
  const user = await getCurrentUser();

  // Get current tracked project
  const currentTracking = await prisma.currentTrack.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      project: true,
    },
  });

  console.log("Current tracking:", currentTracking);

  if (currentTracking && currentTracking.projectId !== id) {
    // Stop tracking the current (other) project.
    await prisma.timeEntry.create({
      data: {
        projectId: currentTracking.projectId,
        startTime: currentTracking.startTime,
        endTime: new Date(),
      },
    });

    // Update current tracking to the new project.
    await prisma.currentTrack.update({
      where: {
        userId: user.id,
      },
      data: {
        projectId: id,
        startTime: new Date(),
      },
    });
  } else if (!currentTracking) {
    // Start tracking the current project.
    await prisma.currentTrack.create({
      data: {
        userId: user.id,
        projectId: id,
        startTime: new Date(),
      },
    });
  }

  const newTracking = await prisma.currentTrack.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      project: true,
    },
  });

  if (!newTracking) {
    return new NextResponse(null, {
      status: 204,
    });
  }

  return new NextResponse(JSON.stringify(newTracking), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function DELETE() {
  const session = await auth();

  if (!session) {
    return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const user = await getCurrentUser();

  // Get current tracked project
  const currentTracking = await prisma.currentTrack.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      project: true,
    },
  });

  if (currentTracking) {
    // Stop tracking the current (other) project.
    await prisma.timeEntry.create({
      data: {
        projectId: currentTracking.projectId,
        startTime: currentTracking.startTime,
        endTime: new Date(),
      },
    });

    await prisma.currentTrack.delete({
      where: {
        userId: user.id,
      },
    });
  }

  return new NextResponse(null, {
    status: 204,
  });
}
