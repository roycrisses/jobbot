import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  // JobBoard is global for now, but applications are tied to users
  const jobs = await prisma.jobListing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      applications: {
        where: {
          userId: session?.user?.id || "",
        },
        select: {
          fitScore: true,
        },
      },
    },
  });

  return NextResponse.json(jobs);
}
