import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CrudPage } from "@/components/CrudPage";
import { fmtCurrency } from "@/lib/format";

interface Product {
  id: string; created_at?: string;
  name: string; category: string | null;
  purchase_price: number | null; selling_price: number | null;
  supplier: string | null; stock: number | null; status: string | null;
}

export const Route = createFileRoute("/_authenticated/products")({
  head: () => ({ meta: [{ title: "Products — MARKITMAX" }] }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <AppShell title="Products">
      <CrudPage<Product>
        table="products"
        title="Product"
        searchKeys={["name","category","supplier"]}
        defaultValues={{ status: "active", stock: 0 }}
        formFields={[
          { key: "name", label: "Name" },
          { key: "category", label: "Category", type: "select", options: [
            "ssl","email","maintenance","website_package","seo","marketing","graphic_design","software",
          ].map((v) => ({ value: v, label: v.replace("_"," ") })) },
          { key: "purchase_price", label: "Purchase price", type: "number" },
          { key: "selling_price", label: "Selling price", type: "number" },
          { key: "supplier", label: "Supplier" },
          { key: "stock", label: "Stock", type: "number" },
          { key: "status", label: "Status", type: "select", options: [
            { value: "active", label: "Active" }, { value: "inactive", label: "Inactive" },
          ] },
          { key: "description" as keyof Product, label: "Description", type: "textarea" },
        ]}
        columns={[
          { key: "name", label: "Product", render: (r) => <div><div className="font-medium">{r.name}</div><div className="text-xs text-muted-foreground capitalize">{r.category?.replace("_"," ")}</div></div> },
          { key: "purchase_price", label: "Cost", render: (r) => fmtCurrency(r.purchase_price) },
          { key: "selling_price", label: "Price", render: (r) => fmtCurrency(r.selling_price) },
          { key: "margin", label: "Margin", render: (r) => fmtCurrency(Number(r.selling_price ?? 0) - Number(r.purchase_price ?? 0)) },
          { key: "stock", label: "Stock" },
          { key: "status", label: "Status", render: (r) => <span className="capitalize">{r.status}</span> },
        ]}
      />
    </AppShell>
  );
}
