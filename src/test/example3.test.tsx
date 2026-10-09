import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { getDeployments } from "../api/diploymentApi";
import type { Deployment } from "../exercise/example1";
import Example3 from "../exercise/example3";

vi.mock("../api/diploymentApi", () => ({
  getDeployments: vi.fn(),
}));

const deployments: Deployment[] = [
  {
    id: "DEP-1001",
    application: "Customer Portal",
    version: "v4.2.1",
    environment: "Production",
    status: "Pending",
    requestedBy: "John Smith",
    requestedAt: "2026-07-18T09:30:00Z",
    scheduledAt: "2026-07-20T10:00:00Z",
    region: "US-East",
    priority: "High",
  },
  {
    id: "DEP-1002",
    application: "Payments API",
    version: "v2.8.0",
    environment: "QA",
    status: "In Progress",
    requestedBy: "Emily Davis",
    requestedAt: "2026-07-18T10:15:00Z",
    scheduledAt: "2026-07-20T11:30:00Z",
    region: "Europe",
    priority: "Critical",
  },
];

function renderQueue() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(<Example3 />, { wrapper: Wrapper });
}

describe("Deployment Queue", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state while fetching deployments", () => {
    vi.mocked(getDeployments).mockReturnValue(new Promise(() => {}));

    renderQueue();

    expect(screen.getByText("Loading deployments...")).toBeInTheDocument();
  });

  it("shows an error state when the request fails", async () => {
    vi.mocked(getDeployments).mockRejectedValue(
      new Error("Service unavailable"),
    );

    renderQueue();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Unable to load deployments: Service unavailable",
    );
  });

  it("shows the active total and filters deployments by search and status", async () => {
    vi.mocked(getDeployments).mockResolvedValue(deployments);

    renderQueue();

    expect(await screen.findByText("Customer Portal")).toBeInTheDocument();
    expect(screen.getByText("Payments API")).toBeInTheDocument();
    expect(screen.getByText("Active Deployments").parentElement).toHaveTextContent(
      "2",
    );

    fireEvent.change(screen.getByLabelText("Search by application name"), {
      target: { value: "PAYMENTS" },
    });
    fireEvent.click(screen.getByRole("button", { name: "In Progress" }));

    expect(screen.getByText("Payments API")).toBeInTheDocument();
    expect(screen.queryByText("Customer Portal")).not.toBeInTheDocument();
    expect(
      screen.getByText("Active Deployments").parentElement,
    ).toHaveTextContent("1");
    expect(screen.getByRole("button", { name: "In Progress" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("shows an empty state when no deployment matches the search", async () => {
    vi.mocked(getDeployments).mockResolvedValue(deployments);

    renderQueue();

    await screen.findByText("Customer Portal");
    fireEvent.change(screen.getByLabelText("Search by application name"), {
      target: { value: "unknown application" },
    });

    expect(screen.getByText("No deployments found")).toBeInTheDocument();
    expect(screen.queryByText("Customer Portal")).not.toBeInTheDocument();
  });
});
