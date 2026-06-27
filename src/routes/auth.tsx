import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { setToken } from "@/lib/auth-token";
import { signInFn, setupAdminFn, hasUsersFn } from "@/lib/auth.functions";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign in — MARKITMAX" }] }),
  component: AuthPage,
});

const credSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
});

function AuthPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const { data: hasUsers, isLoading: checkingUsers } = useQuery({
    queryKey: ["has-users"],
    queryFn: async () => await hasUsersFn(),
  });

  if (!loading && user) return <Navigate to="/dashboard" />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setBusy(true);
    try {
      const result = await signInFn({ data: { email, password } });
      setToken(result.token);
      toast.success("Welcome back");
      nav({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSetupAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = credSchema.safeParse({ email, password });
    if (!parsed.success) return toast.error(parsed.error.errors[0].message);
    setBusy(true);
    try {
      const result = await setupAdminFn({ data: { email, password, fullName: fullName || email.split("@")[0] } });
      setToken(result.token);
      toast.success("Admin account created! Welcome.");
      nav({ to: "/dashboard" });
    } catch (error: any) {
      toast.error(error.message || "Admin setup failed");
    } finally {
      setBusy(false);
    }
  };

  if (checkingUsers) return null;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden flex-col justify-between bg-secondary p-12 lg:flex">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-accent text-accent-foreground">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="font-serif text-xl">MARKITMAX</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-serif text-5xl leading-tight">
            Run your agency<br />the way you think.
          </h1>
          <p className="mt-4 text-muted-foreground">
            Leads, projects, invoices, and accounts — one calm workspace.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} MARKITMAX</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-accent text-accent-foreground">
              <Briefcase className="h-4 w-4" />
            </div>
            <span className="font-serif text-lg">MARKITMAX</span>
          </div>

          <div className="mb-6">
            <h2 className="font-serif text-2xl font-semibold tracking-tight">
              {hasUsers ? "Sign in to your account" : "Setup Admin Account"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {hasUsers ? "Welcome back to your workspace" : "Create the first account to get started"}
            </p>
          </div>

          {hasUsers ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSetupAdmin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-pw">Password</Label>
                <Input id="su-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy ? "Creating…" : "Setup Admin"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
