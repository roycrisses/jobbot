import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FileText, Briefcase, Send, CheckCircle2 } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [resumes, jobs, applications, successCount] = await Promise.all([
    prisma.resume.count({ where: { userId } }),
    prisma.jobListing.count(),
    prisma.application.count({ where: { userId } }),
    prisma.application.count({ where: { userId, status: "Offer" } }),
  ]);

  const stats = [
    { name: "Resumes Parsed", value: resumes, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Jobs Aggregated", value: jobs, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { name: "Applications Generated", value: applications, icon: Send, color: "text-orange-600", bg: "bg-orange-50" },
    { name: "Successful Offers", value: successCount, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <h2 className="text-4xl font-black tracking-tight text-gray-900 font-sans uppercase">
          Welcome back, {session.user.name?.split(' ')[0] || "Agent"}
        </h2>
        <p className="mt-2 text-gray-500 font-medium text-lg">
          Your job search velocity is currently optimized. Check your match signals below.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={stat.name}
            className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-in fade-in zoom-in-95 duration-500 delay-[${i * 100}ms]`}
          >
            <div className="flex flex-col space-y-4">
              <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <dt className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">
                  {stat.name}
                </dt>
                <dd className="text-3xl font-black text-gray-900 mt-1">
                  {stat.value}
                </dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px]">
          <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">
              Recruitment Pipeline
            </h3>
            <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="p-12 text-center space-y-4">
            <div className="bg-gray-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto border border-gray-100">
              <CircleDashed className="w-10 h-10 text-gray-200" />
            </div>
            <p className="text-gray-400 text-sm font-medium max-w-xs mx-auto">
              Real-time activity logs will populate here once you start engaging with matches.
            </p>
          </div>
        </div>

        <div className="bg-black text-white rounded-[2.5rem] p-8 shadow-2xl flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-700" />
          <div className="relative z-10 space-y-6">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400">Pro Signal</h4>
            <p className="text-2xl font-bold leading-tight">
              AI Insight: Tailor your last 3 applications to increase call-back rate by 40%.
            </p>
          </div>
          <button className="relative z-10 mt-8 w-full py-4 bg-white text-black text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-gray-100 transition-all shadow-lg active:scale-95">
            Optimize Now
          </button>
        </div>
      </div>
    </div>
  );
}
