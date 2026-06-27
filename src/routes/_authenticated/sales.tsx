import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CrudPage } from "@/components/CrudPage";
import { useAuth } from "@/hooks/useAuth";
import { fmtCurrency, fmtDate } from "@/lib/format";

interface Sale {
  id: string; created_at?: string;
  product_name: string; category: string | null;
  purchase_cost: number | null; selling_price: number; quantity: number;
  sale_date: string; payment_status: string;
}

export const Route = createFileRoute("/_authenticated/sales")({
  head: () => ({ meta: [{ title: "Sales — MARKITMAX" }] }),
  component: SalesPage,
});

function SalesPage() {
  const { user } = useAuth();
  return (
    <AppShell title="Sales">
      <CrudPage<Sale>
        table="sales"
        title="Sale"
        searchKeys={["product_name","category"]}
        defaultValues={{ payment_status: "pending", quantity: 1, sale_date: new Date().toISOString().slice(0,10) }}
        insertExtras={() => ({ employee_id: user?.id ?? null })}
        formFields={[
          { key: "product_name", label: "Product / Service" },
          { key: "category", label: "Category", type: "select", options: [
            "project","ssl","email","maintenance","other",
          ].map((v) => ({ value: v, label: v })) },
          { key: "purchase_cost", label: "Purchase cost", type: "number" },
          { key: "selling_price", label: "Selling price", type: "number" },
          { key: "quantity", label: "Quantity", type: "number" },
          { key: "sale_date", label: "Date", type: "date" },
          { key: "payment_status", label: "Payment status", type: "select", options: [
            { value: "pending", label: "Pending" }, { value: "paid", label: "Paid" },
          ] },
          { key: "notes" as keyof Sale, label: "Notes", type: "textarea" },
        ]}
        columns={[
          { key: "product_name", label: "Product", render: (r) => <div><div className="font-medium">{r.product_name}</div><div className="text-xs text-muted-foreground">{r.category}</div></div> },
          { key: "selling_price", label: "Price", render: (r) => fmtCurrency(r.selling_price) },
          { key: "quantity", label: "Qty" },
          { key: "profit", label: "Profit", render: (r) => fmtCurrency((Number(r.selling_price)*Number(r.quantity)) - Number(r.purchase_cost ?? 0)) },
          { key: "sale_date", label: "Date", render: (r) => fmtDate(r.sale_date) },
          { key: "payment_status", label: "Status", render: (r) => <span className="capitalize">{r.payment_status}</span> },
        ]}
      />
    </AppShell>
  );
}
