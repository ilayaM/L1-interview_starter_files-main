

/**
 * ============================================================================
 * Exercise 1 - Deployment Card
 * ============================================================================
 *
 * Scenario
 * --------
 *
 * Your team is building an internal Deployment Queue application used by
 * Release Engineers to monitor application deployments.
 *
 * A mock API response has been provided in src/data/MOCK_DATA.ts.
 *
 * In this exercise, your task is to build a reusable DeploymentCard component.
 *
 * ============================================================================
 *
 * ## Requirements

### 1. Component Setup

- Create a `DeploymentCard` component.
- Keep the provided imports unchanged.
- Use React with TypeScript.
- Use the existing Shadcn UI components:
  - Card
  - Badge
  - Button
  - Separator

---
### 2. Deployment Interface

Create the `Deployment` interface with the mockdata properties:
make sure 
environment: "Production" | "QA" | "Development" | "Staging";
status: "Pending" | "In Progress" | "Completed";
priority: "Low" | "Medium" | "High" | "Critical";



 * ============================================================================
 *
 * UI Requirements
 *
 * • Use the provided shadcn/ui components where appropriate.
 *
 * • Environment and Status should be displayed using badges.
 *
 * • Color the left border of the card based on priority.
 *   Priority values in the data are: Low, Medium, High, and Critical.
 *   Choose a distinct color for each priority.
 *
 * • Display a "advance to [next status]" button at the bottom of the card.
 *
 * • Use appropriate spacing and visual hierarchy.
 *
 * • The component should remain responsive.
 *
 * ============================================================================
 *
 * Technical Expectations
 *
 * • Use TypeScript.
 *
 * • Define appropriate interfaces/types.
 *
 * • Keep the component reusable.
 *
 * • Do not hardcode values.
 *
 * • Avoid unnecessary duplication.
 *
 * • Write clean, maintainable code.
 *
 * ============================================================================
 *
 * Evaluation
 *
 * We will evaluate:
 *
 * ✓ React Fundamentals
 * ✓ Component Composition
 * ✓ TypeScript
 * ✓ Code Organization
 * ✓ Reusability
 * ✓ Tailwind CSS
 *
 * ============================================================================
 *
 * Note
 *
 * This exercise focuses only on the DeploymentCard component.
 *
 * Additional requirements will be introduced in later exercises.
 *
 * ============================================================================
 */
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export type DeploymentEnvironment =
  | "Production"
  | "QA"
  | "Development"
  | "Staging";

export type DeploymentStatus = "Pending" | "In Progress" | "Completed";
export type DeploymentPriority = "Low" | "Medium" | "High" | "Critical";

export interface Deployment {
  id: string;
  application: string;
  version: string;
  environment: DeploymentEnvironment;
  status: DeploymentStatus;
  requestedBy: string;
  requestedAt: string;
  scheduledAt: string;
  region: string;
  priority: DeploymentPriority;
}

interface DeploymentCardProps {
  deployment: Deployment;
}

const priorityBorderStyles: Record<DeploymentPriority, string> = {
  Low: "border-l-slate-400",
  Medium: "border-l-sky-500",
  High: "border-l-orange-500",
  Critical: "border-l-red-600",
};

const statusBadgeStyles: Record<DeploymentStatus, string> = {
  Pending: "border-amber-200 bg-amber-100 text-amber-800",
  "In Progress": "border-blue-200 bg-blue-100 text-blue-800",
  Completed: "border-emerald-200 bg-emerald-100 text-emerald-800",
};

const statusOrder: DeploymentStatus[] = ["Pending", "In Progress", "Completed"];

const getNextStatus = (status: DeploymentStatus): DeploymentStatus | null => {
  const currentIndex = statusOrder.indexOf(status);

  if (currentIndex === -1 || currentIndex === statusOrder.length - 1) {
    return null;
  }

  return statusOrder[currentIndex + 1];
};

const formatScheduledDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const DeploymentCard = ({ deployment }: DeploymentCardProps) => {
  const nextStatus = getNextStatus(deployment.status);

  return (
    <Card
      className={[
        "gap-0 border-l-4 border-y border-r border-slate-300 bg-white py-0 shadow-sm transition-shadow hover:shadow-md",
        priorityBorderStyles[deployment.priority],
      ].join(" ")}
    >
      <CardHeader className="gap-0 px-4 pb-4 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg font-medium text-slate-900">
              {deployment.application}
            </CardTitle>
            <CardDescription className="mt-1 text-sm text-slate-500">
              {deployment.version}
            </CardDescription>
          </div>

          <Badge variant="outline" className="shrink-0 rounded-full bg-white px-2.5 text-xs font-normal">
            {deployment.environment}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 px-4 pb-4">
        <div>
          <p className="text-xs text-slate-500">Deployment ID</p>
          <p className="font-semibold text-slate-900">{deployment.id}</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className={["rounded-full px-2.5 font-normal", statusBadgeStyles[deployment.status]].join(" ")}
          >
            {deployment.status}
          </Badge>
          <p className="text-sm text-slate-500">
            Priority <span className="font-semibold text-slate-900">{deployment.priority}</span>
          </p>
        </div>
      </CardContent>

      <Separator />

      <CardContent className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 py-4 text-sm">
        <div>
          <p className="text-slate-500">Requested By</p>
          <p className="mt-0.5 font-medium text-slate-900">{deployment.requestedBy}</p>
        </div>
        <div>
          <p className="text-slate-500">Scheduled</p>
          <p className="mt-0.5 font-medium text-slate-900">
            {formatScheduledDate(deployment.scheduledAt)}
          </p>
        </div>
        <div>
          <p className="text-slate-500">Region</p>
          <p className="mt-0.5 font-medium text-slate-900">{deployment.region}</p>
        </div>
        <div>
          <p className="text-slate-500">Environment</p>
          <p className="mt-0.5 font-medium text-slate-900">{deployment.environment}</p>
        </div>
      </CardContent>

      <CardFooter className="border-t border-slate-200 bg-slate-50 p-3">
        <Button
          type="button"
          disabled={!nextStatus}
          className={[
            "h-8 w-full rounded-lg text-sm font-semibold",
            nextStatus
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "bg-slate-500 text-white opacity-100 hover:bg-slate-500",
          ].join(" ")}
        >
          {nextStatus ? `Advance to ${nextStatus}` : "✓ Completed"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DeploymentCard;
