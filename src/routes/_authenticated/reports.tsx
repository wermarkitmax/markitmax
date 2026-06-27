import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, BarChart3, Receipt, Users, FolderKanban, Globe } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReportCounts, exportTableData } from "@/lib/db";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — MARKITMAX" }] }),
  component: ReportsPage,
});

function toCSV(rows: Record<string, unknown>[]) {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [keys.join(","), ...rows.map((r) => keys.map((k) => esc(r[k])).join(","))].join("\n");
}

function download(name: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

function ReportsPage() {
  const { data } = useQuery({
    queryKey: ["report-counts"],
    queryFn: async () => {
      return await fetchReportCounts();
    },
  });

  const exportTable = async (table: string, label: string) => {
    try {
      const rows = await exportTableData({ data: { table } }) as Record<string, any>[];
      if (!rows || rows.length === 0) return toast.message("Nothing to export");
      download(`${label}-${new Date().toISOString().slice(0,10)}.csv`, toCSV(rows));
      toast.success(`Exported ${rows.length} rows`);
    } catch (error: any) {
      toast.error(error.message || "Export failed");
    }
  };

  const tiles = [
    { key: "leads", label: "Leads", icon: Users },
    { key: "contacts", label: "Contacts", icon: Users },
    { key: "projects", label: "Projects", icon: FolderKanban },
    { key: "invoices", label: "Invoices", icon: FileText },
    { key: "expenses", label: "Expenses", icon: Receipt },
    { key: "sales", label: "Sales", icon: BarChart3 },
  ];

  return (
    <AppShell title="Reports">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((t) => (
          <Card key={t.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.label}</CardTitle>
              <t.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-serif text-3xl">{data?.[t.key as keyof typeof data] ?? "—"}</div>
              <div className="mt-1 text-xs text-muted-foreground">Total records</div>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => exportTable(t.key, t.label)}>
                <Download className="mr-1 h-4 w-4" /> Export CSV
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
