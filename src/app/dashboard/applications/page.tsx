"use client";

import { useEffect, useState } from "react";
import { 
  Send, 
  ChevronRight, 
  MapPin, 
  Building2, 
  Clock, 
  CheckCircle2, 
  CircleDashed,
  ExternalLink,
  MoreVertical,
  MessageSquareText
} from "lucide-react";
import { updateApplicationStatusAction } from "@/app/actions/application";

interface Application {
  id: string;
  status: string;
  fitScore: number | null;
  coverLetter: string | null;
  createdAt: string;
  job: {
    title: string;
    company: string;
    location: string | null;
    url: string;
  };
  resume: {
    title: string;
  } | null;
}

const STATUS_OPTIONS = ["Reviewed", "Applied", "Interviewing", "Offer", "Rejected", "Ghosted"];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    const res = await fetch("/api/applications");
    const data = await res.json();
    setApplications(data);
    setLoading(false);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    // Optimistic update
    setApplications(apps => apps.map(a => a.id === id ? { ...a, status: newStatus } : a));
    await updateApplicationStatusAction(id, newStatus);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <CircleDashed className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans">Application Tracker</h2>
          <p className="mt-2 text-gray-500 font-medium">Manage recruitment stages and recruitment artifacts for all matched roles.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {applications.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-3xl p-20 text-center shadow-sm">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-6 inline-block">
              <Send className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900">No Applications Logged</h3>
            <p className="mt-3 text-sm text-gray-500 max-w-sm mx-auto font-medium">
              Start by running a match analysis on a job listing to generate an application entry.
            </p>
          </div>
        ) : (
          applications.map((app) => (
            <div 
              key={app.id} 
              className="group bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between sm:justify-start sm:space-x-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {app.job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                        <span className="text-sm font-bold text-gray-500">{app.job.company}</span>
                        <div className="flex items-center text-xs text-gray-400 font-bold uppercase tracking-wider space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{app.job.location || "Remote"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                      <span className="text-[10px] font-black uppercase tracking-widest">Fit Score</span>
                      <span className="text-sm font-black">{app.fitScore}%</span>
                    </div>
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-bold">{new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  {/* Status Dropdown */}
                  <div className="relative">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`appearance-none font-black text-[10px] uppercase tracking-widest px-6 py-3 pr-10 rounded-2xl border-2 transition-all cursor-pointer outline-none ${
                        app.status === "Offer" ? "bg-green-600 text-white border-green-600" :
                        app.status === "Interviewing" ? "bg-amber-500 text-white border-amber-500" :
                        app.status === "Rejected" ? "bg-red-50 text-red-600 border-red-100" :
                        "bg-white text-gray-900 border-gray-100"
                      }`}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status} className="bg-white text-black">{status}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-4 top-1/2 -rotate-90 sm:rotate-90 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex-1 sm:flex-none p-3 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-2xl transition-all border border-gray-100">
                      <MessageSquareText className="w-5 h-5" />
                    </button>
                    <a 
                      href={app.job.url} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 sm:flex-none p-3 bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 rounded-2xl transition-all border border-gray-100"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
