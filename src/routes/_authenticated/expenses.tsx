import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CrudPage } from "@/components/CrudPage";
import { useAuth } from "@/hooks/useAuth";
import { fmtCurrency, fmtDate } from "@/lib/format";

interface Expense {
  id: string; created_at?: string;
  title: string; category: string | null; vendor: string | null;
  amount: number; expense_date: string; payment_method: string | null;
}

export const Route = createFileRoute("/_authenticated/expenses")({
  head: () => ({ meta: [{ title: "Expenses — MARKITMAX" }] }),
  component: ExpensesPage,
});

function ExpensesPage() {
  const { user } = useAuth();
  return (
    <AppShell title="Expenses">
      <CrudPage<Expense>
        table="expenses"
        title="Expense"
        searchKeys={["title","vendor","category"]}
        defaultValues={{ expense_date: new Date().toISOString().slice(0,10) }}
        insertExtras={() => ({ created_by: user?.id ?? null })}
        formFields={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category", type: "select", options: [
            "salary","office","marketing","software","hosting","domain","internet","electricity","rent","travel","taxes","misc",
          ].map((v) => ({ value: v, label: v })) },
          { key: "vendor", label: "Vendor" },
          { key: "amount", label: "Amount", type: "number" },
          { key: "gst" as keyof Expense, label: "GST", type: "number" },
          { key: "expense_date", label: "Date", type: "date" },
          { key: "payment_method", label: "Payment method", type: "select", options: [
            { value: "cash", label: "Cash" }, { value: "card", label: "Card" }, { value: "upi", label: "UPI" }, { value: "bank", label: "Bank transfer" },
          ] },
          { key: "description" as keyof Expense, label: "Description", type: "textarea" },
        ]}
        columns={[
          { key: "title", label: "Title", render: (r) => <div><div className="font-medium">{r.title}</div><div className="text-xs text-muted-foreground">{r.vendor}</div></div> },
          { key: "category", label: "Category", render: (r) => <span className="capitalize text-sm">{r.category ?? "—"}</span> },
          { key: "amount", label: "Amount", render: (r) => <span className="font-medium">{fmtCurrency(r.amount)}</span> },
          { key: "expense_date", label: "Date", render: (r) => fmtDate(r.expense_date) },
          { key: "payment_method", label: "Method", render: (r) => r.payment_method ?? "—" },
        ]}
      />
    </AppShell>
  );
}
