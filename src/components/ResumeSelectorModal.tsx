"use client";

import { useEffect, useState } from "react";
import { X, FileText, Loader2, Play } from "lucide-react";
import { generateApplicationAction } from "@/app/actions/application";

interface Resume {
  id: string;
  title: string;
}

export default function ResumeSelectorModal({ 
  jobId, 
  jobTitle,
  company,
  onClose, 
  onMatchComplete 
}: { 
  jobId: string;
  jobTitle: string;
  company: string;
  onClose: () => void;
  onMatchComplete: (data: any) => void;
}) {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/resumes")
      .then(res => res.json())
      .then(data => {
        setResumes(data);
        if (data.length > 0) setSelectedId(data[0].id);
        setLoading(false);
      });
  }, []);

  const handleStartMatch = async () => {
    if (!selectedId) return;
    setProcessing(true);
    setError("");

    const result = await generateApplicationAction(jobId, selectedId);
    
    if (result.success) {
      onMatchComplete(result.data);
    } else {
      setError(result.error || "Analysis failed.");
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black text-gray-900 leading-tight">Match Workflow</h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{jobTitle}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Fetching Resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="py-8 text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-gray-300">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm text-gray-500 font-medium px-6">You haven't uploaded any resumes yet. Go to the Resumes tab first.</p>
              <button onClick={onClose} className="text-sm font-bold text-blue-600">Close</button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Select Profile</label>
                <div className="space-y-2">
                  {resumes.map(r => (
                    <button
                      key={r.id}
                      onClick={() => !processing && setSelectedId(r.id)}
                      className={`w-full flex items-center space-x-4 p-4 rounded-2xl border-2 transition-all text-left ${
                        selectedId === r.id 
                          ? "border-blue-600 bg-blue-50/30" 
                          : "border-gray-100 hover:border-gray-200 bg-gray-50/50"
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${selectedId === r.id ? "bg-blue-600 text-white" : "bg-white text-gray-400 border border-gray-100"}`}>
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className={`text-sm font-bold truncate ${selectedId === r.id ? "text-blue-900" : "text-gray-600"}`}>
                        {r.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl border border-red-100">
                  {error}
                </div>
              )}

              <button
                onClick={handleStartMatch}
                disabled={processing || !selectedId}
                className="w-full flex items-center justify-center space-x-2 py-4 bg-black text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all hover:bg-gray-800 disabled:opacity-30 shadow-xl shadow-black/10 active:scale-[0.98]"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Reasoning...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Match Analysis</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
