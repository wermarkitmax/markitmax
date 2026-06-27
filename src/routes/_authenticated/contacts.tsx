import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { CrudPage } from "@/components/CrudPage";
import { useAuth } from "@/hooks/useAuth";

interface Contact {
  id: string; created_at?: string;
  client_name: string; company: string | null; email: string | null; phone: string | null;
  city: string | null; gst: string | null; website: string | null; category: string | null;
}

export const Route = createFileRoute("/_authenticated/contacts")({
  head: () => ({ meta: [{ title: "Contacts — MARKITMAX" }] }),
  component: ContactsPage,
});

function ContactsPage() {
  const { user } = useAuth();
  return (
    <AppShell title="Contacts">
      <CrudPage<Contact>
        table="contacts"
        title="Contact"
        allowImport={true}
        searchKeys={["client_name", "company", "email", "phone"]}
        filters={[
          { key: "category", label: "Category", options: [
            "real_estate", "healthcare", "ecommerce", "technology", "retail", "education", "finance", "hospitality", "manufacturing", "other"
          ].map(v => ({ value: v, label: v.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") })) }
        ]}
        defaultValues={{}}
        insertExtras={() => ({ created_by: user?.id ?? null })}
        formFields={[
          { key: "client_name", label: "Client name" },
          { key: "company", label: "Company" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "whatsapp" as keyof Contact, label: "WhatsApp" },
          { key: "website", label: "Website" },
          { key: "gst", label: "GST" },
          { key: "pan" as keyof Contact, label: "PAN" },
          { key: "address" as keyof Contact, label: "Address", type: "textarea" },
          { key: "city", label: "City" },
          { key: "state" as keyof Contact, label: "State" },
          { key: "country" as keyof Contact, label: "Country" },
          { key: "category", label: "Category", type: "select", options: [
            "real_estate", "healthcare", "ecommerce", "technology", "retail", "education", "finance", "hospitality", "manufacturing", "other"
          ].map(v => ({ value: v, label: v.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") })) },
          { key: "notes" as keyof Contact, label: "Notes", type: "textarea" },
        ]}
        columns={[
          { key: "client_name", label: "Client", render: (r) => <div><div className="font-medium">{r.client_name}</div><div className="text-xs text-muted-foreground">{r.company}</div></div> },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "category", label: "Category", render: (r) => <span className="capitalize">{r.category?.replace("_", " ") ?? "—"}</span> },
          { key: "city", label: "City" },
          { key: "gst", label: "GST" },
        ]}
      />
    </AppShell>
  );
}
