import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchAccountsData } from "@/lib/db";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtCurrency } from "@/lib/format";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet, Receipt, PiggyBank, Banknote } from "lucide-react";

export const Route = createFileRoute("/_authenticated/accounts")({
  head: () => ({ meta: [{ title: "Accounts — MARKITMAX" }] }),
  component: AccountsPage,
});

function AccountsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["accounts-data"],
    queryFn: async () => {
      return await fetchAccountsData();
    },
  });

  const revenue = (data?.invoices.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total), 0) ?? 0)
    + (data?.sales.reduce((s, i) => s + Number(i.selling_price) * Number(i.quantity ?? 1), 0) ?? 0);
  const expensesTotal = data?.expenses.reduce((s, e) => s + Number(e.amount), 0) ?? 0;
  const profit = revenue - expensesTotal;
  const margin = revenue > 0 ? Math.round((profit / revenue) * 100) : 0;

  // Expense by category
  const byCategory = Object.entries(
    (data?.expenses ?? []).reduce<Record<string, number>>((acc, e) => {
      const k = e.category ?? "misc"; acc[k] = (acc[k] ?? 0) + Number(e.amount); return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  // Last 6 months bar
  const months = (() => {
    const out: { name: string; revenue: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const dt = new Date(); dt.setMonth(dt.getMonth() - i);
      const name = dt.toLocaleDateString("en-US", { month: "short" });
      const m = dt.getMonth(); const y = dt.getFullYear();
      const rev = (data?.invoices ?? []).filter((iv) => {
        const dd = new Date(iv.issue_date); return dd.getMonth() === m && dd.getFullYear() === y && iv.status === "paid";
      }).reduce((s, i) => s + Number(i.total), 0);
      const exp = (data?.expenses ?? []).filter((e) => {
        const dd = new Date(e.expense_date); return dd.getMonth() === m && dd.getFullYear() === y;
      }).reduce((s, i) => s + Number(i.amount), 0);
      out.push({ name, revenue: rev, expenses: exp });
    }
    return out;
  })();

  const cards = [
    { label: "Total Revenue", value: revenue, icon: TrendingUp },
    { label: "Total Expenses", value: expensesTotal, icon: TrendingDown },
    { label: "Net Profit", value: profit, icon: Wallet },
    { label: "Profit Margin", value: `${margin}%`, icon: PiggyBank, raw: true },
    { label: "Avg Invoice", value: data?.invoices.length ? Math.round(data.invoices.reduce((s,i)=>s+Number(i.total),0)/data.invoices.length) : 0, icon: Receipt },
    { label: "Sales Count", value: data?.sales.length ?? 0, icon: Banknote, raw: true },
  ];

  const pieColors = ["var(--accent)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

  return (
    <AppShell title="Accounts">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="mt-2 font-serif text-3xl">{isLoading ? "—" : c.raw ? c.value : fmtCurrency(Number(c.value))}</div>
                </div>
                <c.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Monthly Cash Flow</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer>
                <BarChart data={months}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                  <Legend />
                  <Bar dataKey="revenue" fill="var(--accent)" radius={[6,6,0,0]} />
                  <Bar dataKey="expenses" fill="var(--muted-foreground)" radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Expenses by Category</CardTitle></CardHeader>
          <CardContent>
            <div className="h-72">
              {byCategory.length === 0 ? (
                <div className="grid h-full place-items-center text-sm text-muted-foreground">No expenses yet</div>
              ) : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={80}>
                      {byCategory.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
