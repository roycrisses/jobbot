"use client";

import { useState } from "react";
import { uploadResumeAction } from "@/app/actions/resume";
import { X, Upload, Loader2, CheckCircle } from "lucide-react";

export default function UploadResumeModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadResumeAction(formData);

    if (result.success) {
      setStatus("success");
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setStatus("error");
      setErrorMessage(result.error || "An unknown error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Upload Resume</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center py-8 text-center animate-in fade-in zoom-in duration-300">
              <div className="bg-green-100 p-3 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-medium text-gray-900">Processing Success</h4>
              <p className="text-sm text-gray-500 mt-1">Your resume has been parsed and stored.</p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="relative group border-2 border-dashed border-gray-200 rounded-xl p-8 transition-colors hover:border-blue-400 bg-gray-50/50">
                  <input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF or DOCX (max. 5MB)</p>
                  </div>
                </div>

                {status === "error" && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-100">
                    {errorMessage}
                  </div>
                )}
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!file || status === "uploading"}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                  {status === "uploading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    "Extract Resume"
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
