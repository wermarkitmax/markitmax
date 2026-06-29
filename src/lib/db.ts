// Database query server functions using Prisma ORM
// All functions run on the server and are callable from client components
import { createServerFn } from "@tanstack/react-start";
import { prisma } from "./prisma";

// ============ GENERIC CRUD ============

// Type mapping from table name string to Prisma delegate
type TableName =
  | "leads"
  | "contacts"
  | "projects"
  | "invoices"
  | "invoice_items"
  | "expenses"
  | "sales"
  | "products"
  | "activity_logs"
  | "profiles"
  | "user_roles";

function getDelegate(table: TableName) {
  const map = {
    leads: prisma.lead,
    contacts: prisma.contact,
    projects: prisma.project,
    invoices: prisma.invoice,
    invoice_items: prisma.invoiceItem,
    expenses: prisma.expense,
    sales: prisma.sale,
    products: prisma.product,
    activity_logs: prisma.activityLog,
    profiles: prisma.profile,
    user_roles: prisma.userRole,
  } as const;
  return map[table];
}

// Map snake_case field names from the UI to camelCase Prisma field names
function snakeToCamel(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

// Map camelCase Prisma results back to snake_case for the UI
function camelToSnake(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    const snakeKey = key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
    result[snakeKey] = value;
  }
  return result;
}

function transformResults(rows: Record<string, any>[]): Record<string, any>[] {
  return rows.map((row) => {
    const transformed = camelToSnake(row);
    // Convert Date objects to ISO strings and Decimal to numbers for JSON serialization
    for (const [key, value] of Object.entries(transformed)) {
      if (value instanceof Date) {
        transformed[key] = value.toISOString();
      } else if (typeof value === "object" && value !== null && "toNumber" in value) {
        transformed[key] = (value as { toNumber(): number }).toNumber();
      }
    }
    return transformed;
  });
}

export const fetchRecords = createServerFn({ method: "GET" })
  .validator((data: { table: string }) => data)
  .handler(async ({ data }): Promise<Record<string, any>[]> => {
    const delegate = getDelegate(data.table as TableName) as any;
    const rows = await delegate.findMany({
      orderBy: { createdAt: "desc" },
    });
    return transformResults(rows) as any;
  });

export const createRecord = createServerFn({ method: "POST" })
  .validator((data: { table: string; values: Record<string, any> }) => data)
  .handler(async ({ data }): Promise<Record<string, any>> => {
    const delegate = getDelegate(data.table as TableName) as any;
    const camelData = snakeToCamel(data.values);
    // Remove null/undefined id to let the database generate it
    if (!camelData.id) delete camelData.id;
    // Convert date strings to Date objects for Prisma
    for (const [key, value] of Object.entries(camelData)) {
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        camelData[key] = new Date(value + "T00:00:00.000Z");
      }
    }
    const row = await delegate.create({ data: camelData });
    return transformResults([row])[0] as any;
  });

export const updateRecord = createServerFn({ method: "POST" })
  .validator(
    (data: { table: string; id: string; values: Record<string, any> }) =>
      data,
  )
  .handler(async ({ data }): Promise<Record<string, any>> => {
    const delegate = getDelegate(data.table as TableName) as any;
    const camelData = snakeToCamel(data.values);
    delete camelData.id;
    delete camelData.createdAt;
    delete camelData.updatedAt;
    // Convert date strings to Date objects for Prisma
    for (const [key, value] of Object.entries(camelData)) {
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        camelData[key] = new Date(value + "T00:00:00.000Z");
      }
    }
    const row = await delegate.update({
      where: { id: data.id },
      data: camelData,
    });
    return transformResults([row])[0] as any;
  });

export const deleteRecord = createServerFn({ method: "POST" })
  .validator((data: { table: string; id: string }) => data)
  .handler(async ({ data }) => {
    const delegate = getDelegate(data.table as TableName) as any;
    const row = await delegate.delete({
      where: { id: data.id },
    });
    return { success: true, id: row.id };
  });

export const bulkDeleteRecordsFn = createServerFn({ method: "POST" })
  .validator((data: { table: string; ids: string[] }) => data)
  .handler(async ({ data }) => {
    const delegate = getDelegate(data.table as TableName) as any;
    const result = await delegate.deleteMany({
      where: { id: { in: data.ids } },
    });
    return { success: true, count: result.count };
  });

export const bulkCreateRecordsFn = createServerFn({ method: "POST" })
  .validator((data: { table: string; values: Record<string, any>[] }) => data)
  .handler(async ({ data }) => {
    const delegate = getDelegate(data.table as TableName) as any;
    
    // Map snake_case to camelCase and convert dates
    const rows = data.values.map(val => {
      const camelData = snakeToCamel(val);
      if (!camelData.id) delete camelData.id;
      for (const [key, value] of Object.entries(camelData)) {
        if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
          camelData[key] = new Date(value + "T00:00:00.000Z");
        }
      }
      return camelData;
    });

    try {
      const result = await delegate.createMany({
        data: rows,
        skipDuplicates: true,
      });
      return { success: true, count: result.count };
    } catch (e: any) {
      console.error("Prisma CreateMany Error:", e.message);
      const lines = e.message.split('\n');
      // The real error reason is usually at the bottom
      const reason = lines.length > 5 ? lines.slice(-5).join('\n') : e.message;
      throw new Error("Import failed: " + reason);
    }
  });

// ============ DASHBOARD ============

export const fetchDashboardStats = createServerFn({ method: "GET" })
  .handler(async () => {
    const [leads, contacts, projects, invoices, expenses, sales] = await Promise.all([
      prisma.lead.findMany({ select: { id: true, status: true, createdAt: true } }),
      prisma.contact.findMany({ select: { id: true } }),
      prisma.project.findMany({
        select: { id: true, status: true, finalPrice: true, receivedAmount: true },
      }),
      prisma.invoice.findMany({
        select: { id: true, total: true, status: true, issueDate: true },
      }),
      prisma.expense.findMany({
        select: { id: true, amount: true, expenseDate: true },
      }),
      prisma.sale.findMany({
        select: { id: true, sellingPrice: true, purchaseCost: true, quantity: true, saleDate: true, paymentStatus: true },
      }),
    ]);

    const salesRevenue = sales
      .filter((s) => s.paymentStatus === "paid")
      .reduce((sum, s) => sum + Number(s.sellingPrice) * Number(s.quantity ?? 1), 0);
    const salesPending = sales
      .filter((s) => s.paymentStatus !== "paid")
      .reduce((sum, s) => sum + Number(s.sellingPrice) * Number(s.quantity ?? 1), 0);
    const salesExpense = sales.reduce((sum, s) => sum + Number(s.purchaseCost ?? 0), 0);

    const revenue = invoices
      .filter((i) => i.status === "paid")
      .reduce((s, i) => s + Number(i.total), 0) + salesRevenue;
    const pending = invoices
      .filter((i) => i.status !== "paid")
      .reduce((s, i) => s + Number(i.total), 0) + salesPending;
    const expenseTotal = expenses.reduce((s, e) => s + Number(e.amount), 0) + salesExpense;

    return {
      leadsTotal: leads.length,
      leadsWon: leads.filter((l) => l.status === "won").length,
      contactsTotal: contacts.length,
      projectsRunning: projects.filter((p) => p.status === "running").length,
      projectsCompleted: projects.filter((p) =>
        ["completed", "delivered"].includes(p.status),
      ).length,
      revenue,
      pending,
      expenses: expenseTotal,
      profit: revenue - expenseTotal,
      invoicesArr: invoices.map((i) => ({
        id: i.id,
        total: Number(i.total),
        status: i.status,
        issue_date: i.issueDate.toISOString(),
      })),
      expensesArr: expenses.map((e) => ({
        id: e.id,
        amount: Number(e.amount),
        expense_date: e.expenseDate.toISOString(),
      })),
      salesArr: sales.map((s) => ({
        id: s.id,
        selling_price: Number(s.sellingPrice),
        purchase_cost: Number(s.purchaseCost ?? 0),
        quantity: Number(s.quantity ?? 1),
        sale_date: s.saleDate.toISOString(),
        payment_status: s.paymentStatus,
      })),
    };
  });

// ============ ACCOUNTS ============

export const fetchAccountsData = createServerFn({ method: "GET" })
  .handler(async () => {
    const [inv, exp, sales] = await Promise.all([
      prisma.invoice.findMany({
        select: { total: true, status: true, issueDate: true },
      }),
      prisma.expense.findMany({
        select: { amount: true, category: true, expenseDate: true },
      }),
      prisma.sale.findMany({
        select: { sellingPrice: true, purchaseCost: true, quantity: true, saleDate: true, paymentStatus: true },
      }),
    ]);

    return {
      invoices: inv.map((i) => ({
        total: Number(i.total),
        status: i.status,
        issue_date: i.issueDate.toISOString(),
      })),
      expenses: exp.map((e) => ({
        amount: Number(e.amount),
        category: e.category,
        expense_date: e.expenseDate.toISOString(),
      })),
      sales: sales.map((s) => ({
        selling_price: Number(s.sellingPrice),
        purchase_cost: Number(s.purchaseCost ?? 0),
        quantity: Number(s.quantity ?? 1),
        sale_date: s.saleDate.toISOString(),
        payment_status: s.paymentStatus,
      })),
    };
  });

// ============ EMPLOYEES ============

export const fetchEmployees = createServerFn({ method: "GET" })
  .handler(async () => {
    const profiles = await prisma.profile.findMany({
      select: {
        id: true, fullName: true, email: true, phone: true,
        department: true, joiningDate: true, createdAt: true,
      },
    });
    const roles = await prisma.userRole.findMany({
      select: { userId: true, role: true },
    });
    const roleMap = new Map(roles.map((r) => [r.userId, r.role]));
    return profiles.map((p) => ({
      id: p.id,
      full_name: p.fullName,
      email: p.email,
      phone: p.phone,
      department: p.department,
      joining_date: p.joiningDate?.toISOString() ?? null,
      created_at: p.createdAt.toISOString(),
      role: roleMap.get(p.id) ?? "employee",
    }));
  });

// ============ ACTIVITY LOGS ============

export const fetchActivityLogs = createServerFn({ method: "GET" })
  .handler(async () => {
    const logs = await prisma.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return logs.map((l) => ({
      id: l.id,
      user_id: l.userId,
      action: l.action,
      entity_type: l.entityType,
      entity_id: l.entityId,
      details: l.details,
      created_at: l.createdAt.toISOString(),
    }));
  });

// ============ REPORTS ============

export const fetchReportCounts = createServerFn({ method: "GET" })
  .handler(async () => {
    const [l, c, p, i, e, s] = await Promise.all([
      prisma.lead.count(),
      prisma.contact.count(),
      prisma.project.count(),
      prisma.invoice.count(),
      prisma.expense.count(),
      prisma.sale.count(),
    ]);
    return { leads: l, contacts: c, projects: p, invoices: i, expenses: e, sales: s };
  });

export const exportTableData = createServerFn({ method: "GET" })
  .validator((data: { table: string }) => data)
  .handler(async ({ data }): Promise<Record<string, any>[]> => {
    const delegate = getDelegate(data.table as TableName) as any;
    const rows = await delegate.findMany();
    return transformResults(rows) as any;
  });

// ============ SETTINGS ============

export const updateProfile = createServerFn({ method: "POST" })
  .validator(
    (data: { userId: string; fullName: string; phone: string }) => data,
  )
  .handler(async ({ data }) => {
    await prisma.profile.update({
      where: { id: data.userId },
      data: { fullName: data.fullName, phone: data.phone },
    });
    return { success: true };
  });
