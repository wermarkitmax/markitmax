import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CrudPage } from "@/components/CrudPage";
import { useAuth } from "@/hooks/useAuth";
import { fmtCurrency, fmtDate } from "@/lib/format";

interface Invoice {
  id: string; created_at?: string;
  invoice_number: string;
  issue_date: string; due_date: string | null;
  subtotal: number; tax_amount: number; discount: number; total: number;
  status: string; notes: string | null;
}

const statusColor: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  cancelled: "bg-rose-100 text-rose-800",
};

export const Route = createFileRoute("/_authenticated/invoices")({
  head: () => ({ meta: [{ title: "Invoices — MARKITMAX" }] }),
  component: InvoicesPage,
});

function InvoicesPage() {
  const { user } = useAuth();
  const next = `INV-${Date.now().toString().slice(-6)}`;
  return (
    <AppShell title="Invoices">
      <CrudPage<Invoice>
        table="invoices"
        title="Invoice"
        searchKeys={["invoice_number", "notes"]}
        defaultValues={{ invoice_number: next, status: "pending", issue_date: new Date().toISOString().slice(0,10) }}
        insertExtras={() => ({ created_by: user?.id ?? null })}
        formFields={[
          { key: "invoice_number", label: "Invoice #" },
          { key: "issue_date", label: "Issue date", type: "date" },
          { key: "due_date", label: "Due date", type: "date" },
          { key: "subtotal", label: "Subtotal", type: "number" },
          { key: "tax_amount", label: "Tax", type: "number" },
          { key: "discount", label: "Discount", type: "number" },
          { key: "total", label: "Total", type: "number" },
          { key: "status", label: "Status", type: "select", options: [
            { value: "pending", label: "Pending" }, { value: "paid", label: "Paid" }, { value: "cancelled", label: "Cancelled" },
          ] },
          { key: "notes", label: "Notes", type: "textarea" },
        ]}
        columns={[
          { key: "invoice_number", label: "Invoice #", render: (r) => <span className="font-mono text-sm">{r.invoice_number}</span> },
          { key: "issue_date", label: "Issued", render: (r) => fmtDate(r.issue_date) },
          { key: "due_date", label: "Due", render: (r) => fmtDate(r.due_date) },
          { key: "total", label: "Total", render: (r) => <span className="font-medium">{fmtCurrency(r.total)}</span> },
          { key: "status", label: "Status", render: (r) => <span className={`rounded-full px-2 py-0.5 text-xs ${statusColor[r.status] ?? "bg-secondary"}`}>{r.status}</span> },
        ]}
      />
    </AppShell>
  );
}
