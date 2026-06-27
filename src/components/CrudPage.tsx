import { type ReactNode, useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchRecords, createRecord, updateRecord, deleteRecord, bulkCreateRecordsFn, bulkDeleteRecordsFn } from "@/lib/db";
import { toast } from "sonner";
import { Plus, Search, Trash2, Pencil, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Papa from "papaparse";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface CrudPageProps<T extends { id: string }> {
  table: string;
  columns: Column<T>[];
  searchKeys?: (keyof T)[];
  defaultValues: Partial<T>;
  formFields: {
    key: keyof T;
    label: string;
    type?: "text" | "number" | "date" | "textarea" | "select";
    options?: { value: string; label: string }[];
  }[];
  title: string;
  insertExtras?: () => Record<string, unknown>;
  allowImport?: boolean;
  filters?: { key: keyof T; label: string; options: { value: string; label: string }[] }[];
}

export function CrudPage<T extends { id: string; created_at?: string }>(props: CrudPageProps<T>) {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importCategory, setImportCategory] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data = [], isLoading } = useQuery({
    queryKey: [props.table],
    queryFn: async () => {
      const rows = await fetchRecords({ data: { table: props.table } });
      return (rows ?? []) as T[];
    },
  });

  const filtered = data.filter((row) => {
    // Check dropdown filters first
    for (const [fKey, fVal] of Object.entries(activeFilters)) {
      if (fVal && String((row as Record<string, unknown>)[fKey] ?? "") !== fVal) {
        return false;
      }
    }
    
    // Check search query
    if (!search) return true;
    const q = search.toLowerCase();
    return (props.searchKeys ?? []).some((k) => String((row as Record<string, unknown>)[k as string] ?? "").toLowerCase().includes(q));
  });

  const saveMut = useMutation({
    mutationFn: async (values: Partial<T>) => {
      if (editing) {
        await updateRecord({ data: { table: props.table, id: editing.id, values: values as Record<string, unknown> } });
      } else {
        const extras = props.insertExtras?.() ?? {};
        const filtersExtras = Object.fromEntries(Object.entries(activeFilters).filter(([_, v]) => v !== ""));
        await createRecord({ data: { table: props.table, values: { ...values, ...extras, ...filtersExtras } as Record<string, unknown> } });
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Updated" : "Created");
      qc.invalidateQueries({ queryKey: [props.table] });
      setOpen(false); setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      await deleteRecord({ data: { table: props.table, id } });
    },
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: [props.table] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkDeleteMut = useMutation({
    mutationFn: async (ids: string[]) => {
      await bulkDeleteRecordsFn({ data: { table: props.table, ids } });
    },
    onSuccess: () => {
      toast.success("Deleted selected records");
      qc.invalidateQueries({ queryKey: [props.table] });
      setSelectedIds(new Set());
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkImportMut = useMutation({
    mutationFn: async (values: Record<string, any>[]) => {
      const extras = props.insertExtras?.() ?? {};
      const withExtras = values.map(v => ({ ...v, ...extras }));
      return await bulkCreateRecordsFn({ data: { table: props.table, values: withExtras } });
    },
    onSuccess: (res) => {
      toast.success(`Imported ${res.count} records successfully`);
      qc.invalidateQueries({ queryKey: [props.table] });
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values: Record<string, unknown> = {};
    for (const f of props.formFields) {
      const v = fd.get(f.key as string);
      if (v === null || v === "") { values[f.key as string] = null; continue; }
      values[f.key as string] = f.type === "number" ? Number(v) : v;
    }
    saveMut.mutate(values as Partial<T>);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
      complete: (results) => {
        if (results.errors.length > 0) {
          toast.error("Error parsing CSV file");
          console.error(results.errors);
          return;
        }
        if (results.data.length > 0) {
          let rows = results.data as Record<string, any>[];
          
          // List of allowed keys (from form fields + common database fields)
          const validKeys = new Set([
            ...props.formFields.map(f => f.key as string),
            "created_by", "assigned_to", "category", "source", "status", "priority", 
            "email", "phone"
          ]);

          const cleanedRows = rows.map(row => {
            let r = { ...row };
            
            if (importCategory) r.category = importCategory;
            
            // Map Name column for Contacts
            if (props.table === "contacts" && r.name && !r.client_name) {
              r.client_name = r.name;
            }
            // Map Client Name column for Leads
            if (props.table === "leads" && r.client_name && !r.name) {
              r.name = r.client_name;
            }

            // Auto-map firstname/lastname to name/client_name
            if (!r.name && !r.client_name) {
              const fname = r.firstname || r.first_name || "";
              const mname = r.midname || r.middle_name || "";
              const lname = r.lastname || r.last_name || "";
              if (fname || mname || lname) {
                const fullName = `${fname} ${mname} ${lname}`.replace(/\s+/g, " ").trim();
                if (props.table === "contacts") r.client_name = fullName;
                else r.name = fullName;
              }
            }
            
            // Fallback for REQUIRED name field
            if (props.table === "leads" && !r.name) {
               r.name = "Unknown Lead";
            }
            if (props.table === "contacts" && !r.client_name) {
               r.client_name = "Unknown Contact";
            }

            // Strip invalid keys and empty strings
            const cleaned: Record<string, any> = {};
            for (const key of Object.keys(r)) {
              if (validKeys.has(key) && r[key] !== "") {
                cleaned[key] = r[key];
              }
            }
            return cleaned;
          }).filter(r => Object.keys(r).length > 2); // Must have at least something other than category/assigned_to

          bulkImportMut.mutate(cleanedRows);
        }
      },
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-60">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          
          {props.filters?.map((f) => (
            <select
              key={f.key as string}
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              value={activeFilters[f.key as string] || ""}
              onChange={(e) => setActiveFilters(prev => ({ ...prev, [f.key as string]: e.target.value }))}
            >
              <option value="">{f.label} (All)</option>
              {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ))}

          <Badge variant="outline">{filtered.length}</Badge>
          
          {props.allowImport && (
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline"><Upload className="mr-1 h-4 w-4" /> Import CSV</Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogHeader><DialogTitle>Import Data</DialogTitle></DialogHeader>
                <div className="grid gap-4 py-4">
                  {props.filters?.find(f => f.key === 'category') && (
                    <div className="grid gap-2">
                      <label className="text-sm font-medium">Assign to Category (Optional)</label>
                      <select
                        className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                        value={importCategory}
                        onChange={(e) => setImportCategory(e.target.value)}
                      >
                        <option value="">-- No Category --</option>
                        {props.filters.find(f => f.key === 'category')?.options.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={(e) => { handleFileUpload(e); setImportDialogOpen(false); }} />
                  <Button onClick={() => fileInputRef.current?.click()} disabled={bulkImportMut.isPending}>
                    {bulkImportMut.isPending ? "Importing…" : "Choose File & Upload"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {selectedIds.size > 0 && (
            <Button variant="destructive" onClick={() => { if (confirm(`Delete ${selectedIds.size} records?`)) bulkDeleteMut.mutate(Array.from(selectedIds)); }} disabled={bulkDeleteMut.isPending}>
              <Trash2 className="mr-1 h-4 w-4" /> Delete ({selectedIds.size})
            </Button>
          )}

          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-1 h-4 w-4" /> New</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editing ? `Edit ${props.title}` : `New ${props.title}`}</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-3">
                {props.formFields.map((f) => {
                  const val = (editing ?? props.defaultValues) as Record<string, unknown>;
                  const dv = val[f.key as string] ?? "";
                  return (
                    <div key={f.key as string} className="grid gap-1.5">
                      <label className="text-xs font-medium text-muted-foreground">{f.label}</label>
                      {f.type === "textarea" ? (
                        <textarea name={f.key as string} defaultValue={String(dv ?? "")} rows={3}
                          className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
                      ) : f.type === "select" ? (
                        <select name={f.key as string} defaultValue={String(dv ?? "")}
                          className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                          <option value="">—</option>
                          {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      ) : (
                        <Input name={f.key as string} type={f.type ?? "text"} defaultValue={String(dv ?? "")} />
                      )}
                    </div>
                  );
                })}
                <DialogFooter className="mt-2">
                  <Button type="submit" disabled={saveMut.isPending}>{saveMut.isPending ? "Saving…" : "Save"}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox 
                    checked={filtered.length > 0 && selectedIds.size === filtered.length}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedIds(new Set(filtered.map(r => r.id)));
                      else setSelectedIds(new Set());
                    }} 
                  />
                </TableHead>
                {props.columns.map((c) => <TableHead key={String(c.key)} className={c.className}>{c.label}</TableHead>)}
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={props.columns.length + 2} className="py-10 text-center text-muted-foreground">Loading…</TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={props.columns.length + 2} className="py-10 text-center text-muted-foreground">No records yet.</TableCell></TableRow>
              ) : filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedIds.has(row.id)}
                      onCheckedChange={(checked) => {
                        const next = new Set(selectedIds);
                        if (checked) next.add(row.id);
                        else next.delete(row.id);
                        setSelectedIds(next);
                      }}
                    />
                  </TableCell>
                  {props.columns.map((c) => (
                    <TableCell key={String(c.key)} className={c.className}>
                      {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "—")}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(row); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("Delete this record?")) delMut.mutate(row.id); }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
