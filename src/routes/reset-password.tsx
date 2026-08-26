import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoAsset from "../assets/software-vala-logo.jpg.asset.json";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password | Software Vala" },
      {
        name: "description",
        content: "Set a new password for your Software Vala account.",
      },
      { property: "og:title", content: "Reset Password | Software Vala" },
      {
        property: "og:description",
        content: "Set a new password for your Software Vala account.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The recovery link puts a session in the URL hash; wait for it.
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setReady(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Both passwords must match.");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated. You can sign in now.");
      navigate({ to: "/login", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update password.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07101f] px-4">
      <div className="sv-grain z-30" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full shadow-lg ring-2 ring-white/10">
            <img src={logoAsset.url} alt="Software Vala logo" className="h-full w-full object-cover" />
          </div>
          <div>
            <div className="text-base font-bold text-white">Software Vala</div>
            <div className="text-[10px] text-white/35">The Name of Trust</div>
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-white">Set a new password</h1>
        <p className="mt-2 text-sm text-white/45">
          {ready
            ? "Choose a strong password you haven't used before."
            : "Open this page from the reset link in your email to continue."}
        </p>

        <div
          className="mt-6 rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl"
          style={{ boxShadow: "0 24px 60px -20px rgba(0,0,0,.55), inset 0 1px 0 rgba(255,255,255,.06)" }}
        >
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="new-password" className="mb-2 block text-xs text-white/60 sm:text-sm">
                New password
              </label>
              <div className="group relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-amber-200/70"
                />
                <input
                  id="new-password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a new password"
                  className="h-13 w-full rounded-2xl border border-white/10 bg-white/[0.045] py-3.5 pl-12 pr-12 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-amber-200/30 focus:bg-white/[0.07]"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white"
                  aria-label={show ? "Hide password" : "Show password"}
                >
                  {show ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="mb-2 block text-xs text-white/60 sm:text-sm">
                Confirm password
              </label>
              <div className="group relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-amber-200/70"
                />
                <input
                  id="confirm-password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat the new password"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.045] py-3.5 pl-12 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-white/25 focus:border-amber-200/30 focus:bg-white/[0.07]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy || !ready}
              className="relative h-13 w-full overflow-hidden rounded-2xl bg-[#e31b23] py-3.5 text-sm font-semibold text-white shadow-[0_12px_35px_rgba(227,27,35,.22)] transition-all duration-300 hover:bg-[#f1262f] active:scale-[.98] disabled:opacity-60"
            >
              <div className="sv-shine" />
              <span className="relative">{busy ? "Updating…" : "Update password"}</span>
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-white/35">
          <button
            type="button"
            onClick={() => navigate({ to: "/login" })}
            className="text-white transition hover:text-red-400"
          >
            Back to sign in
          </button>
        </p>
      </div>
      <Toaster richColors position="bottom-right" />
    </main>
  );
}
