"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { extractResumeData } from "@/lib/anthropic";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import { revalidatePath } from "next/cache";

export async function uploadResumeAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { error: "No file uploaded" };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  let rawText = "";

  try {
    if (file.type === "application/pdf") {
      const data = await pdf(buffer);
      rawText = data.text;
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const data = await mammoth.extractRawText({ buffer });
      rawText = data.value;
    } else {
      return { error: "Unsupported file type. Please upload PDF or DOCX." };
    }
  } catch (err) {
    console.error("Text extraction failed:", err);
    return { error: "Failed to read file contents." };
  }

  if (!rawText.trim()) {
    return { error: "The file appears to be empty." };
  }

  // Extract structured data via Anthropic
  const structuredData = await extractResumeData(rawText);

  if (!structuredData) {
    return { error: "AI failed to parse the resume content." };
  }

  // Save to database
  await prisma.resume.create({
    data: {
      userId: session.user.id,
      title: file.name,
      content: rawText,
      parsedData: JSON.stringify(structuredData),
    },
  });

  revalidatePath("/dashboard/resumes");
  return { success: true };
}
