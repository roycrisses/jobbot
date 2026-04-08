"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addJobAction(formData: FormData) {
  const title = formData.get("title") as string;
  const company = formData.get("company") as string;
  const description = formData.get("description") as string;
  const url = formData.get("url") as string;
  const location = formData.get("location") as string;

  if (!title || !company || !description || !url) {
    return { error: "Missing required fields" };
  }

  try {
    await prisma.jobListing.create({
      data: {
        title,
        company,
        description,
        url,
        location,
      },
    });
  } catch (err) {
    console.error("Failed to add job:", err);
    return { error: "Job with this URL already exists or internal error." };
  }

  revalidatePath("/dashboard/jobs");
  return { success: true };
}
