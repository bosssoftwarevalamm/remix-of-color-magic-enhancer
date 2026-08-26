// @ts-nocheck
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/ams/shared/PageHeader";
import { createTicket } from "@/lib/ams/tickets.functions";
import { AMS_PRIORITIES, PRIORITY_META, type AmsPriority } from "@/lib/ams/tickets.types";

export const Route = createFileRoute("/_authenticated/ams/new")({
  head: () => ({
    meta: [
      { title: "New ticket — AMS" },
      { name: "description", content: "Capture an issue and route it to the right team." },
      { property: "og:title", content: "New ticket — AMS" },
      { property: "og:description", content: "Capture an issue and route it to the right team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: NewTicketPage,
});

function NewTicketPage() {
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<AmsPriority>("medium");
  const [department, setDepartment] = useState("");
  const [team, setTeam] = useState("");
  const [expected, setExpected] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(asSubmit: boolean) {
    if (!subject.trim()) { toast.error("Subject is required"); return; }
    setSaving(true);
    try {
      const row = await createTicket({
        data: {
          subject, description, product, category, priority,
          department, team,
          expected_resolution_at: expected ? new Date(expected).toISOString() : null,
          submit: asSubmit,
        },
      });
      toast.success(asSubmit ? "Ticket submitted" : "Draft saved");
      navigate({ to: "/ams/$id", params: { id: row.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to create ticket");
    } finally { setSaving(false); }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Button asChild variant="ghost" size="sm" className="gap-1.5 -ml-2"><Link to="/ams"><ChevronLeft className="h-4 w-4" /> Back to tickets</Link></Button>
      <PageHeader kicker="Create" title="New AMS ticket" description="Capture an issue and route it to the right team." />

      <div className="surface-card p-6 space-y-5">
        <Field label="Subject *">
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary of the issue" />
        </Field>
        <Field label="Description">
          <Textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What happened? Steps, expected vs actual, links…" />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Product"><Input value={product} onChange={(e) => setProduct(e.target.value)} /></Field>
          <Field label="Category"><Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Bug, Feature request, Question…" /></Field>
          <Field label="Priority">
            <Select value={priority} onValueChange={(v) => setPriority(v as AmsPriority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{AMS_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{PRIORITY_META[p].label}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Expected resolution"><Input type="datetime-local" value={expected} onChange={(e) => setExpected(e.target.value)} /></Field>
          <Field label="Department"><Input value={department} onChange={(e) => setDepartment(e.target.value)} /></Field>
          <Field label="Team"><Input value={team} onChange={(e) => setTeam(e.target.value)} /></Field>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => submit(false)} disabled={saving} className="gap-1.5"><Save className="h-4 w-4" /> Save draft</Button>
        <Button onClick={() => submit(true)} disabled={saving} className="gap-1.5"><Send className="h-4 w-4" /> Submit</Button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</Label>
      {children}
    </div>
  );
}
