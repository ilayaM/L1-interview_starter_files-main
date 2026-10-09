/**
 * ============================================================================
 * Exercise 2 - useDeploymentFilters
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * The Release Engineering team would like to make the Deployment Queue easier
 * to navigate as the number of deployments continues to grow.
 *
 * Your task is to implement a reusable custom hook that manages searching
 * and filtering deployment data.
 *
 * ============================================================================
 *
 * Create a custom hook named:
 *
 *      useDeploymentFilters
 *
 * ============================================================================
 *
 * The hook should accept an array of deployments.
 *
 * Example
 *
 * const {
 *   search,
 *   setSearch,
 *   filteredDeployments
 * } = useDeploymentFilters(deployments);
 *
 * ============================================================================
 *
 * Functional Requirements
 *
 * The hook should:
 *
 * ✓ Maintain the search text
 *
 * ✓ Return a filtered list of deployments
 *
 * ✓ Filter by Application Name
 *
 * ✓ Filtering should be case-insensitive
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use React Hooks
 *
 * • Use TypeScript
 *
 * • Keep the hook reusable
 *
 *
 * • Prefer performant solutions where appropriate
 *
 * ============================================================================
 *
 * Notes
 *
 * • Do not modify the supplied deployment data.
 *
 * • This hook will be reused in the next exercise.
 *
 * • Additional filtering requirements may be introduced later.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * ✓ Custom Hooks
 * ✓ TypeScript
 * ✓ React Fundamentals
 * ✓ Code Quality
 * ✓ Reusability
 * ✓ Performance
 *
 * ============================================================================
 */
import { useMemo, useState } from "react";
import { data } from "../data/MOCK_DATA";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SearchableDeployment {
  application: string;
}

export function useDeploymentFilters<T extends SearchableDeployment>(
  deployments: T[],
) {
  const [search, setSearch] = useState("");
  const filteredDeployments = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return deployments;
    }

    return deployments.filter((deployment) =>
      deployment.application.toLocaleLowerCase().includes(normalizedSearch),
    );
  }, [deployments, search]);

  return {
    search,
    setSearch,
    filteredDeployments,
  };
}

const SearchPlaceholder = () => {
  const { search, setSearch, filteredDeployments } = useDeploymentFilters(data);

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <section className="mx-auto max-w-3xl space-y-5">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">
            Deployment Search
          </h1>
          <p className="text-sm text-slate-600">
            Search deployments by application name.
          </p>
        </header>

        <label
          className="block space-y-2 text-sm font-medium text-slate-700"
          htmlFor="deployment-search"
        >
          Application name
          <input
            id="deployment-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search applications..."
            className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus-visible:border-slate-500 focus-visible:ring-2 focus-visible:ring-slate-300"
          />
        </label>

        {filteredDeployments.length > 0 ? (
          <ul className="grid gap-3 sm:grid-cols-2">
            {filteredDeployments.map((deployment) => (
              <li key={deployment.id}>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{deployment.application}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex justify-between gap-3 text-sm text-slate-600">
                    <span>{deployment.id}</span>
                    <span>{deployment.status}</span>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-600">
            No deployments match “{search}”.
          </p>
        )}
      </section>
    </main>
  );
};

export default SearchPlaceholder;
