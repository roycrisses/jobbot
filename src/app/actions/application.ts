"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { analyzeJobMatch } from "@/lib/anthropic";
import { revalidatePath } from "next/cache";

export async function generateApplicationAction(jobId: string, resumeId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const [resume, job] = await Promise.all([
      prisma.resume.findUnique({ where: { id: resumeId } }),
      prisma.jobListing.findUnique({ where: { id: jobId } }),
    ]);

    if (!resume || !job) {
      return { error: "Resume or Job not found." };
    }

    // Call AI to analyze match
    const result = await analyzeJobMatch(resume.content, job.description);

    if (!result) {
      return { error: "AI analysis failed." };
    }

    // Create or Update Application
    await prisma.application.upsert({
      where: {
        userId_jobId: {
          userId: session.user.id,
          jobId: jobId,
        },
      },
      update: {
        resumeId,
        fitScore: result.fitScore,
        coverLetter: result.coverLetter,
        status: "Reviewed", // Automatically moved to Reviewed status
      },
      create: {
        userId: session.user.id,
        jobId: jobId,
        resumeId: resumeId,
        fitScore: result.fitScore,
        coverLetter: result.coverLetter,
        status: "Reviewed",
      },
    });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard/jobs");

    return { 
      success: true, 
      data: {
        fitScore: result.fitScore,
        strengths: result.strengths,
        gaps: result.gaps,
        coverLetter: result.coverLetter
      }
    };
  } catch (err) {
    console.error("Application generation failed:", err);
    return { error: "Internal server error during analysis." };
  }
}

export async function updateApplicationStatusAction(applicationId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err) {
    console.error("Status update failed:", err);
    return { error: "Failed to update status." };
  }
}
