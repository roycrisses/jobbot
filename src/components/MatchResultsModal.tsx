"use client";

import { useState } from "react";
import { X, Check, Copy, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";

interface MatchData {
  fitScore: number;
  strengths: string[];
  gaps: string[];
  coverLetter: string;
}

export default function MatchResultsModal({ 
  data, 
  onClose,
  jobTitle,
  company 
}: { 
  data: MatchData; 
  onClose: () => void;
  jobTitle: string;
  company: string;
}) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"analysis" | "cover-letter">("analysis");

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-900 leading-tight">Match Analysis</h3>
            <p className="text-sm text-gray-500 font-medium">{jobTitle} @ {company}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 space-y-8">
          {/* Fit Score Circle */}
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke="#f3f4f6"
                  strokeWidth="8"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  fill="transparent"
                  stroke={data.fitScore > 70 ? "#10b981" : data.fitScore > 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="8"
                  strokeDasharray={364.4}
                  strokeDashoffset={364.4 - (364.4 * data.fitScore) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-gray-900">{data.fitScore}%</span>
                <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Fit Score</span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex p-1 bg-gray-100 rounded-2xl w-fit mx-auto">
            <button
              onClick={() => setActiveTab("analysis")}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === "analysis" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Analysis
            </button>
            <button
              onClick={() => setActiveTab("cover-letter")}
              className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
                activeTab === "cover-letter" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Cover Letter
            </button>
          </div>

          {activeTab === "analysis" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Key Strengths</h4>
                </div>
                <div className="space-y-2">
                  {data.strengths.map((s, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-green-50/50 border border-green-100 rounded-xl">
                      <Sparkles className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-700 leading-snug">{s}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-xs font-black uppercase tracking-widest">Gap Analysis</h4>
                </div>
                <div className="space-y-2">
                  {data.gaps.map((g, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-amber-50/50 border border-amber-100 rounded-xl">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                      <p className="text-sm text-gray-700 leading-snug">{g}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in slide-in-from-bottom-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500">Suggested Letter</h4>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-all"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy to Clipboard"}</span>
                </button>
              </div>
              <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-serif">
                {data.coverLetter}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-lg active:scale-95 shadow-black/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
