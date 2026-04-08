"use client";

import { useEffect, useState } from "react";
import { FileUp, FileText, Trash2, Eye } from "lucide-react";
import UploadResumeModal from "@/components/UploadResumeModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Resume {
  id: string;
  title: string;
  createdAt: string;
  parsedData: string | null;
}

export default function ResumesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchResumes();
    }
  }, [status, router]);

  const fetchResumes = async () => {
    try {
      const response = await fetch("/api/resumes");
      const data = await response.json();
      setResumes(data);
    } catch (error) {
      console.error("Failed to fetch resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">My Resumes</h2>
          <p className="mt-2 text-gray-500">Manage and parse your resumes with AI for better job matching.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 shadow-black/10"
        >
          <FileUp className="w-5 h-5" />
          <span>Add New Resume</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resumes.length === 0 ? (
          <div className="col-span-full bg-gray-50/50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-12 text-center">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
              <FileText className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No resumes yet</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
              Upload your resume in PDF or DOCX format to start automating your applications.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-6 text-sm font-bold text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              Upload your first resume
            </button>
          </div>
        ) : (
          resumes.map((resume) => (
            <div
              key={resume.id}
              className="group relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1 truncate pr-8">{resume.title}</h3>
              <p className="text-xs text-gray-400 mb-4">
                Uploaded {new Date(resume.createdAt).toLocaleDateString()}
              </p>
              
              <div className="mt-auto">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-md border border-green-100">
                    AI Parsed
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && <UploadResumeModal onClose={() => {
        setIsModalOpen(false);
        fetchResumes(); // Refresh the list
      }} />}
    </div>
  );
}
