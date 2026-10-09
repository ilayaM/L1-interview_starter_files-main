/**
 * ============================================================================
 * Exercise 3 - Deployment Queue
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Congratulations!
 *
 * The DeploymentCard component and search functionality have been completed.
 *
 * Your next task is to build the Deployment Queue page by integrating the
 * previous exercises.
 *
 * ============================================================================
 *
 * Requirements
 *
 * Build a Deployment Queue page using the supplied mock API response.
 *
 * The page should display all deployments using the DeploymentCard component
 * created in Exercise 1.
 *
 * Use the custom hook created in Exercise 2 for searching deployments.
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * 1. Fetch deployments using React Query.
 *
 * 2. Display all deployments.
 *
 * 3. Search deployments by Application Name.
 *
 * 4. Display the following summary:
 *
 *      Total Deployments
 *
 * 5. Add a Status filter.
 *
 *      All
 *      Pending
 *      In Progress
 *      Completed
 *      Failed
 *
 * 6. Display an Empty State when no deployments match the search/filter.
 *
 * 7. Display a Loading State while data is loading.
 *
 * 8. Display an Error State when the request fails.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • React Query
 *
 * • TypeScript
 *
 * • Reusable Components
 *
 * • Clean Folder Structure
 *
 * • Avoid duplicated logic
 *
 * • Use the custom hook from Exercise 2
 *
 * ============================================================================
 *
 * Bonus (Optional)
 *
 * If time permits, implement one or more of the following:
 *
 * • Sort deployments by Scheduled Date
 *
 * • Display deployment counts grouped by Status
 *
 * • Display the number of filtered deployments
 *
 * • Highlight the matched search text
 *
 * ============================================================================
 *
 * Notes
 *
 * • You may create additional components if needed.
 *
 * • You may extend the custom hook created in Exercise 2.
 *
 * • Focus on clean architecture over visual appearance.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ React
 * ✓ React Query
 * ✓ TypeScript
 * ✓ Component Composition
 * ✓ Hooks
 * ✓ State Management
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 */

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getDeployments } from "../api/diploymentApi";
import { useDeploymentFilters } from "./example2";
import DeploymentCard from "./example1";

const statusFilters = [
  "All",
  "Pending",
  "In Progress",
  "Completed",
] as const;

type StatusFilter = (typeof statusFilters)[number];

export default function Example3() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const {
    data: deployments = [],
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["deployments"],
    queryFn: getDeployments,
  });
  const { search, setSearch, filteredDeployments } =
    useDeploymentFilters(deployments);
  const visibleDeployments = filteredDeployments.filter(
    (deployment) =>
      statusFilter === "All" || deployment.status === statusFilter,
  );

  if (isPending) {
    return (
      <main className="min-h-screen bg-slate-200 p-4 sm:p-6">
        <p className="mx-auto max-w-6xl rounded-lg border bg-white p-6 text-center text-sm text-slate-600">
          Loading deployments...
        </p>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-slate-200 p-4 sm:p-6">
        <p role="alert" className="mx-auto max-w-6xl rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          Unable to load deployments: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-200 px-4 py-6 sm:px-6">
      <section className="mx-auto max-w-6xl space-y-6">
        <header className="flex min-h-32 flex-col justify-between gap-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-6 text-white shadow-md sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              <span aria-hidden="true">🚀 </span>Deployment Queue
            </h1>
            <p className="mt-1 text-sm text-slate-300 sm:text-base">
              Monitor deployment requests across environments.
            </p>
          </div>
          <div className="flex min-w-40 flex-col items-center justify-center rounded-xl border border-slate-600 bg-slate-800/70 px-5 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Active Deployments
            </p>
            <p className="text-3xl font-bold leading-8">{visibleDeployments.length}</p>
          </div>
        </header>

        <section className="space-y-4 rounded-2xl border border-slate-300 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-sm font-semibold text-slate-900">Search &amp; Filters</h2>
          <label className="sr-only" htmlFor="deployment-search">
            Search by application name
          </label>
            <input
              id="deployment-search"
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by application name..."
              className="h-8 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-sm outline-none placeholder:text-slate-500 focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-300"
            />
          <div aria-label="Filter by status" className="flex flex-wrap gap-2">
            {statusFilters.map((status) => (
              <button
                key={status}
                type="button"
                aria-pressed={statusFilter === status}
                onClick={() => setStatusFilter(status)}
                className={[
                  "rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400",
                  statusFilter === status
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-100",
                ].join(" ")}
              >
                {status}
              </button>
            ))}
          </div>
        </section>

        {visibleDeployments.length > 0 ? (
          <ul className="grid gap-5 md:grid-cols-3">
            {visibleDeployments.map((deployment) => (
              <li key={deployment.id}>
                <DeploymentCard deployment={deployment} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-400 bg-white p-10 text-center">
            <h2 className="font-semibold text-slate-900">No deployments found</h2>
            <p className="mt-1 text-sm text-slate-600">
              Try changing your search or status filter.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
