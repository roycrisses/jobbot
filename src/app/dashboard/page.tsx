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

  const [resumes, jobs, applications] = await Promise.all([
    prisma.resume.count({ where: { userId } }),
    prisma.jobListing.count(), // global for now
    prisma.application.count({ where: { userId } }),
  ]);

  const stats = [
    { name: "Resumes Parsed", value: resumes, icon: FileText },
    { name: "Jobs Aggregated", value: jobs, icon: Briefcase },
    { name: "Applications Generated", value: applications, icon: Send },
    { name: "Successful Applies", value: 0, icon: CheckCircle2 }, // Placeholder for actual state
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Welcome back, {session.user.name || "User"}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Here is what's happening with your job search today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden border border-gray-200 rounded-xl"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-bold text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add standard simple empty state container for recent activity */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-200">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Recent Activity
          </h3>
        </div>
        <div className="p-6 text-center text-gray-500 text-sm">
          No recent activity to display.
        </div>
      </div>
    </div>
  );
}
