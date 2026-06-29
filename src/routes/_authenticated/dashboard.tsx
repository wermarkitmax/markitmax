import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats } from "@/lib/db";
import { useAuth } from "@/hooks/useAuth";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtCurrency, fmtNumber } from "@/lib/format";
import {
  Users, FolderKanban, FileText, Wallet, TrendingUp, TrendingDown,
  Receipt, UserSquare2,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — MARKITMAX" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { role } = useAuth();
  const isAdmin = role === "admin";

  const stats = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      return await fetchDashboardStats();
    },
  });

  const d = stats.data;

  // Monthly revenue/expense series (last 6 months)
  const monthly = (() => {
    const months: { name: string; revenue: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const dt = new Date(); dt.setMonth(dt.getMonth() - i);
      const key = dt.toLocaleDateString("en-US", { month: "short" });
      const monthIdx = dt.getMonth(); const year = dt.getFullYear();
      
      const rev = (d?.invoicesArr ?? []).filter((iv) => {
        const dd = new Date(iv.issue_date);
        return dd.getMonth() === monthIdx && dd.getFullYear() === year && iv.status === "paid";
      }).reduce((s, i) => s + Number(i.total), 0) + (d?.salesArr ?? []).filter((s) => {
        const dd = new Date(s.sale_date);
        return dd.getMonth() === monthIdx && dd.getFullYear() === year && s.payment_status === "paid";
      }).reduce((sum, s) => sum + Number(s.selling_price) * Number(s.quantity ?? 1), 0);

      const exp = (d?.expensesArr ?? []).filter((e) => {
        const dd = new Date(e.expense_date);
        return dd.getMonth() === monthIdx && dd.getFullYear() === year;
      }).reduce((s, e) => s + Number(e.amount), 0) + (d?.salesArr ?? []).filter((s) => {
        const dd = new Date(s.sale_date);
        return dd.getMonth() === monthIdx && dd.getFullYear() === year;
      }).reduce((sum, s) => sum + Number(s.purchase_cost ?? 0), 0);

      months.push({ name: key, revenue: rev, expenses: exp });
    }
    return months;
  })();

  const adminCards = [
    { label: "Revenue", value: fmtCurrency(d?.revenue), icon: TrendingUp, hint: "Paid invoices & sales" },
    { label: "Expenses", value: fmtCurrency(d?.expenses), icon: TrendingDown, hint: "All time + sales costs" },
    { label: "Net Profit", value: fmtCurrency(d?.profit), icon: Wallet, hint: "Revenue − Expenses" },
    { label: "Outstanding", value: fmtCurrency(d?.pending), icon: Receipt, hint: "Unpaid invoices & sales" },
  ];
  const opsCards = [
    { label: "Leads", value: fmtNumber(d?.leadsTotal), icon: Users, hint: `${d?.leadsWon ?? 0} won` },
    { label: "Contacts", value: fmtNumber(d?.contactsTotal), icon: UserSquare2, hint: "Active clients" },
    { label: "Running Projects", value: fmtNumber(d?.projectsRunning), icon: FolderKanban, hint: `${d?.projectsCompleted ?? 0} completed` },
    { label: "Invoices", value: fmtNumber(d?.invoicesArr?.length), icon: FileText, hint: "Generated" },
  ];
  const cards = isAdmin ? [...adminCards, ...opsCards] : opsCards;

  const projectPie = [
    { name: "Running", value: d?.projectsRunning ?? 0 },
    { name: "Completed", value: d?.projectsCompleted ?? 0 },
  ];
  const pieColors = ["var(--accent)", "var(--success)"];

  return (
    <AppShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label} className="border-border">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{c.label}</div>
                  <div className="mt-2 font-serif text-3xl">{stats.isLoading ? "—" : c.value}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{c.hint}</div>
                </div>
                <c.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAdmin && (
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><CardTitle className="text-base font-medium">Revenue vs Expenses · Last 6 months</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer>
                  <AreaChart data={monthly}>
                    <defs>
                      <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8 }} />
                    <Area type="monotone" dataKey="revenue" stroke="var(--accent)" fill="url(#rev)" strokeWidth={2} />
                    <Area type="monotone" dataKey="expenses" stroke="var(--muted-foreground)" fill="url(#exp)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base font-medium">Project Status</CardTitle></CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={projectPie} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={4}>
                      {projectPie.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
