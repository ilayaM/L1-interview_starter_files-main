import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDeploymentFilters } from "../exercise/example2";

const deployments = [
  { id: "DEP-1", application: "Customer Portal" },
  { id: "DEP-2", application: "Payments API" },
  { id: "DEP-3", application: "Customer Reports" },
];

describe("useDeploymentFilters", () => {
  it("returns all deployments when the search is empty", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    expect(result.current.search).toBe("");
    expect(result.current.filteredDeployments).toEqual(deployments);
  });

  it("filters application names case-insensitively by partial match", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("cUsToMeR");
    });

    expect(result.current.search).toBe("cUsToMeR");
    expect(result.current.filteredDeployments).toEqual([
      deployments[0],
      deployments[2],
    ]);
  });

  it("ignores surrounding whitespace and returns no results for no match", () => {
    const { result } = renderHook(() => useDeploymentFilters(deployments));

    act(() => {
      result.current.setSearch("  PAYMENTS  ");
    });

    expect(result.current.filteredDeployments).toEqual([deployments[1]]);

    act(() => {
      result.current.setSearch("unknown");
    });

    expect(result.current.filteredDeployments).toEqual([]);
  });
});
