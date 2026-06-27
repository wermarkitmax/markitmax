import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CrudPage } from "@/components/CrudPage";
import { useAuth } from "@/hooks/useAuth";
import { fmtCurrency, fmtDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: string; created_at?: string;
  name: string; project_type: string | null; status: string;
  deadline: string | null; final_price: number | null; received_amount: number | null;
}

const statusColor: Record<string, string> = {
  not_started: "bg-slate-100 text-slate-800",
  running: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  delivered: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({ meta: [{ title: "Projects — MARKITMAX" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { user, role } = useAuth();

  const formFields = [
    { key: "name", label: "Project name" },
    { key: "project_type", label: "Type", type: "select", options: [
      "website","web_app","android_app","ios_app","seo","marketing","graphic_design","logo","ui_ux"
    ].map((v) => ({ value: v, label: v.replace("_"," ") })) },
    { key: "status", label: "Status", type: "select", options: [
      { value: "not_started", label: "Not started" }, { value: "running", label: "Running" },
      { value: "completed", label: "Completed" }, { value: "delivered", label: "Delivered" }, { value: "cancelled", label: "Cancelled" },
    ] },
    { key: "deadline", label: "Deadline", type: "date" },
    ...(role === "admin" ? [
      { key: "budget" as keyof Project, label: "Budget", type: "number" },
      { key: "final_price", label: "Final price", type: "number" },
      { key: "received_amount", label: "Received", type: "number" },
      { key: "purchase_cost" as keyof Project, label: "Purchase cost", type: "number" },
    ] : []),
    { key: "notes" as keyof Project, label: "Notes", type: "textarea" },
  ] as any;

  const columns = [
    { key: "name", label: "Project", render: (r: any) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.project_type?.replace("_"," ") ?? "—"}</div></div> },
    { key: "status", label: "Status", render: (r: any) => <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[r.status] ?? "bg-secondary"}`}>{r.status.replace("_"," ")}</span> },
    { key: "deadline", label: "Deadline", render: (r: any) => fmtDate(r.deadline) },
    ...(role === "admin" ? [
      { key: "final_price", label: "Price", render: (r: any) => fmtCurrency(r.final_price) },
      { key: "received_amount", label: "Received", render: (r: any) => fmtCurrency(r.received_amount) },
      { key: "balance", label: "Balance", render: (r: any) => <Badge variant="outline">{fmtCurrency(Number(r.final_price ?? 0) - Number(r.received_amount ?? 0))}</Badge> },
    ] : []),
  ];

  return (
    <AppShell title="Projects">
      <CrudPage<Project>
        table="projects"
        title="Project"
        searchKeys={["name", "project_type"]}
        defaultValues={{ status: "not_started" }}
        insertExtras={() => ({ created_by: user?.id ?? null, assigned_to: user?.id ?? null })}
        formFields={formFields}
        columns={columns}
      />
    </AppShell>
  );
}
