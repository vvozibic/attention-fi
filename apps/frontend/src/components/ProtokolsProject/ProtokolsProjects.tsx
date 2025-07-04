import { ArrowDown, ArrowUp } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ProtokolsProject } from "../../types";
import { formatNumber } from "../../utils/formatNumber";
import { FeaturedProjects } from "../FeaturedProjects";
import Pagination from "../Pagination";
import ProjectDetailOverlay from "../ProjectDetailOverlay";
import { TableSkeleton } from "../TableSkeleton";
import { usePaginatedData } from "../usePaginatedData";

const fetchPaginatedProjects = async ({
  page,
  limit,
  sortField,
  sortDirection,
}: {
  page: number;
  limit: number;
  sortField: string;
  sortDirection: string;
}) => {
  const res = await fetch(
    `/api/p-projects/paginate?page=${page}&limit=${limit}&sortField=${sortField}&sortDirection=${sortDirection}`
  );
  if (!res.ok) throw new Error("Failed to fetch projects");
  return await res.json();
};

type SortField =
  | "mindsharePercent"
  | "followersCount"
  | "totalViews"
  | "marketCap"
  | "price";

const ProtokolsProjectsTable: React.FC = () => {
  const [activeOverlayTab, setActiveOverlayTab] = useState<
    "overview" | "pools"
  >("overview");
  const [selectedProject, setSelectedProject] =
    useState<ProtokolsProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [featuredProjects, setFeaturedProjects] = useState<ProtokolsProject[]>(
    []
  );

  const {
    data: projects,
    total,
    page,
    limit,
    sortField,
    sortDirection,
    loading,
    setPage,
    setSortField,
    setSortDirection,
  } = usePaginatedData<ProtokolsProject>(
    fetchPaginatedProjects,
    1,
    20,
    "mindsharePercent",
    "desc"
  );

  const handleProjectClick = (
    project: ProtokolsProject,
    tab?: "overview" | "pools"
  ) => {
    if (tab) setActiveOverlayTab(tab);
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };
  // const handleSort = (field: keyof ProtokolsProject) => {
  //   if (field === sortField) {
  //     setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
  //   } else {
  //     setSortField(field);
  //     setSortDirection("asc");
  //   }
  // };

  useEffect(() => {
    fetch("/api/p-projects/featured")
      .then((res) => res.json())
      .then(setFeaturedProjects)
      .catch(console.error);
  }, []);

  return (
    <>
      <FeaturedProjects
        projects={featuredProjects}
        handleOpenProject={handleProjectClick}
      />

      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-100 sm:text-4xl">
          Top Global Mindshare
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-400 sm:mt-4">
          Explore top Web3 projects and their attention metrics
        </p>
      </div>

      {Boolean(!projects.length) ? (
        <TableSkeleton />
      ) : (
        <div
          className={`bg-primary-800 rounded-lg shadow-lg overflow-hidden border border-primary-700 relative z-10 ${
            loading ? "opacity-80 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-primary-700">
              <thead className="bg-primary-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                    Project
                  </th>
                  <th
                    onClick={() => handleSort("mindsharePercent")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                  >
                    Mindshare{" "}
                    {sortField === "mindsharePercent" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      ))}
                  </th>
                  <th
                    onClick={() => handleSort("followersCount")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                  >
                    Followers{" "}
                    {sortField === "followersCount" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      ))}
                  </th>
                  <th
                    onClick={() => handleSort("totalViews")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                  >
                    Views{" "}
                    {sortField === "totalViews" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      ))}
                  </th>
                  <th
                    onClick={() => handleSort("marketCap")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                  >
                    Market Cap{" "}
                    {sortField === "marketCap" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      ))}
                  </th>
                  <th
                    onClick={() => handleSort("price")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase cursor-pointer"
                  >
                    Price{" "}
                    {sortField === "price" &&
                      (sortDirection === "asc" ? (
                        <ArrowUp className="inline h-4 w-4" />
                      ) : (
                        <ArrowDown className="inline h-4 w-4" />
                      ))}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-primary-800 divide-y divide-primary-700">
                {projects.map((proj) => (
                  <tr
                    key={proj.id}
                    className="hover:bg-primary-600 transition-colors cursor-pointer"
                    onClick={() => handleProjectClick(proj)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start gap-3">
                        <img
                          src={proj.avatarUrl || "/default-avatar.png"}
                          className="h-10 w-10 rounded-full"
                          alt={proj.name}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-200">
                            {proj.name}
                          </div>
                          <div className="flex gap-2 flex-wrap align-center">
                            <div className="text-sm text-gray-400">
                              @{proj.twitterUsername}
                            </div>
                            <div className="flex flex-wrap">
                              {proj.narrativeLinks
                                ?.sort(
                                  (a, b) =>
                                    (b.projectMindsharePercent || 0) -
                                    (a.projectMindsharePercent || 0)
                                )
                                .slice(0, 1)
                                .map((link, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-primary-600 text-gray-100 text-xs px-2 py-0.5 rounded-full"
                                  >
                                    {link.narrative.name}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proj.mindsharePercent?.toFixed(2)}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proj.followersCount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proj.totalViews?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proj.marketCap
                        ? `$${formatNumber(proj.marketCap)}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-200">
                      {proj.price ? `$${proj.price.toFixed(2)}` : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ProjectDetailOverlay
        isOpen={isModalOpen}
        activeTab={activeOverlayTab}
        setActiveTab={setActiveOverlayTab}
        onClose={() => setIsModalOpen(false)}
        project={selectedProject}
        isAuthenticated={true}
        onLogin={() => {}}
      />

      {Boolean(projects.length) && (
        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
        />
      )}
    </>
  );
};

export default ProtokolsProjectsTable;
