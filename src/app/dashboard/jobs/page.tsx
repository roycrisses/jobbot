"use client";

import { useEffect, useState } from "react";
import { Briefcase, Plus, Loader2, Target, ExternalLink } from "lucide-react";
import AddJobModal from "@/components/AddJobModal";
import ResumeSelectorModal from "@/components/ResumeSelectorModal";
import MatchResultsModal from "@/components/MatchResultsModal";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  url: string;
  createdAt: string;
  applications: {
    fitScore: number | null;
  }[];
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeJobForMatch, setActiveJobForMatch] = useState<Job | null>(null);
  const [matchData, setMatchData] = useState<any>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch("/api/jobs");
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 font-sans">Job Opportunities</h2>
          <p className="mt-2 text-gray-500 font-medium">Aggregate and analyze potential roles using custom profile personas.</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-black text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-gray-800 transition-all shadow-xl active:scale-95 shadow-black/10"
        >
          <Plus className="w-5 h-5" />
          <span>Ingest Job Listing</span>
        </button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-20 text-center border-t border-gray-50">
            <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 mb-6">
              <Briefcase className="w-12 h-12 text-gray-300" />
            </div>
            <h3 className="text-xl font-black text-gray-900">Zero Listings Found</h3>
            <p className="mt-3 text-sm text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
              Manually add a job description or activate the automated scraper to populate your feed.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-50">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Job Detail</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Company Info</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">AI Fit Score</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Workflow</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-50">
                {jobs.map((job) => {
                  const fitScore = job.applications[0]?.fitScore;
                  return (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">{job.title}</span>
                          <span className="text-xs text-gray-400 mt-1 font-bold uppercase tracking-tighter">{job.location || "Remote"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-gray-600">{job.company}</span>
                          <a href={job.url} target="_blank" rel="noreferrer" className="text-gray-300 hover:text-black transition-colors">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {fitScore !== undefined && fitScore !== null ? (
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${fitScore > 70 ? "bg-green-500" : fitScore > 40 ? "bg-amber-500" : "bg-red-500"}`} />
                            <span className="text-sm font-black text-gray-900">{fitScore}%</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Not Analyzed</span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={() => setActiveJobForMatch(job)}
                          className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-50 border border-gray-100 text-gray-900 text-xs font-black uppercase tracking-widest rounded-xl hover:bg-black hover:text-white transition-all active:scale-95"
                        >
                          <Target className="w-4 h-4" />
                          <span>Run Match</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isAddModalOpen && <AddJobModal onClose={() => {
        setIsAddModalOpen(false);
        fetchJobs();
      }} />}

      {activeJobForMatch && !matchData && (
        <ResumeSelectorModal
          jobId={activeJobForMatch.id}
          jobTitle={activeJobForMatch.title}
          company={activeJobForMatch.company}
          onClose={() => setActiveJobForMatch(null)}
          onMatchComplete={(data) => setMatchData(data)}
        />
      )}

      {matchData && activeJobForMatch && (
        <MatchResultsModal
          data={matchData}
          jobTitle={activeJobForMatch.title}
          company={activeJobForMatch.company}
          onClose={() => {
            setMatchData(null);
            setActiveJobForMatch(null);
            fetchJobs(); // Update the score in the list
          }}
        />
      )}
    </div>
  );
}
