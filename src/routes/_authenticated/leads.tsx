import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CrudPage } from "@/components/CrudPage";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { fmtDate } from "@/lib/format";

interface Lead {
  id: string; created_at?: string;
  name: string; company: string | null; email: string | null; phone: string | null; whatsapp: string | null;
  source: string | null; status: string; priority: string;
  category: string | null;
  follow_up_date: string | null; notes: string | null;
}

const statusColor: Record<string, string> = {
  interested: "bg-blue-100 text-blue-800",
  follow_up: "bg-amber-100 text-amber-800",
  negotiation: "bg-purple-100 text-purple-800",
  won: "bg-emerald-100 text-emerald-800",
  lost: "bg-rose-100 text-rose-800",
};

export const Route = createFileRoute("/_authenticated/leads")({
  head: () => ({ meta: [{ title: "Leads — MARKITMAX" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  const { user } = useAuth();
  return (
    <AppShell title="Leads">
      <CrudPage<Lead>
        table="leads"
        title="Lead"
        allowImport={true}
        searchKeys={["name", "company", "email", "phone"]}
        filters={[
          { key: "category", label: "Category", options: [
            "real_estate", "healthcare", "ecommerce", "technology", "retail", "education", "finance", "hospitality", "manufacturing", "other"
          ].map(v => ({ value: v, label: v.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") })) }
        ]}
        defaultValues={{ status: "interested", priority: "medium" }}
        insertExtras={() => ({ created_by: user?.id ?? null, assigned_to: user?.id ?? null })}
        formFields={[
          { key: "name", label: "Lead name" },
          { key: "company", label: "Company" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "whatsapp", label: "WhatsApp" },
          { key: "source", label: "Source", type: "select", options: [
            { value: "facebook", label: "Facebook" }, { value: "instagram", label: "Instagram" },
            { value: "google", label: "Google" }, { value: "referral", label: "Referral" }, { value: "website", label: "Website" },
          ] },
          { key: "status", label: "Status", type: "select", options: [
            { value: "interested", label: "Interested" }, { value: "follow_up", label: "Follow up" },
            { value: "negotiation", label: "Negotiation" }, { value: "won", label: "Won" }, { value: "lost", label: "Lost" },
          ] },
          { key: "priority", label: "Priority", type: "select", options: [
            { value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" },
          ] },
          { key: "category", label: "Category", type: "select", options: [
            "real_estate", "healthcare", "ecommerce", "technology", "retail", "education", "finance", "hospitality", "manufacturing", "other"
          ].map(v => ({ value: v, label: v.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") })) },
          { key: "follow_up_date", label: "Follow-up date", type: "date" },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
        columns={[
          { key: "name", label: "Name", render: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground">{r.company}</div></div> },
          { key: "email", label: "Contact", render: (r) => <div className="text-xs"><div>{r.email}</div><div className="text-muted-foreground">{r.phone}</div></div> },
          { key: "source", label: "Source", render: (r) => r.source ? <Badge variant="outline" className="capitalize">{r.source}</Badge> : "—" },
          { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[r.status] ?? "bg-secondary"}`}>{r.status.replace("_"," ")}</span> },
          { key: "priority", label: "Priority", render: (r) => <span className="capitalize text-sm">{r.priority}</span> },
          { key: "follow_up_date", label: "Follow-up", render: (r) => fmtDate(r.follow_up_date) },
        ]}
      />
    </AppShell>
  );
}
