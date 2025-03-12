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
  const projects = await prisma.project.findMany({
    where: { userId: user.id },
  });

  return new NextResponse(JSON.stringify(projects), {
    headers: { "Content-Type": "application/json" },
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

  const user = await getCurrentUser();

  try {
    const { name, description, color } = await request.json();

    if (!name) {
      return new NextResponse(
        JSON.stringify({ error: "Project name is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const project = await prisma.project.create({
      data: {
        userId: user.id,
        name,
        description,
        color,
      },
    });

    return new NextResponse(JSON.stringify(project), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating project:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to create project" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
