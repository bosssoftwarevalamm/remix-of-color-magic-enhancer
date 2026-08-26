// @ts-nocheck
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquare, Search, Send, Paperclip, Smile, Mic, Phone, Video,
  MoreVertical, Shield, CheckCheck, Globe, Sparkles, Inbox, Users,
  Hash, Star, Pin, Archive, Bell, Plus, X, ChevronRight, IdCard,
  Languages, Bot, Filter, Settings2, Lock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { RealtimeChannel } from "@supabase/supabase-js";

type ConvId = string;
type Conversation = {
  id: ConvId;
  title: string;
  module: string;
  allowed_roles: string[];
  updated_at: string;
};
type Message = {
  id: string;
  conversation_id: string;
  sender_id: string | null;
  body: string;
  created_at: string;
  metadata: Record<string, unknown>;
};

const ROLE_FILTERS = [
  "All", "user", "admin", "super_admin", "vendor", "reseller", "affiliate",
  "influencer", "creator", "author", "developer", "seo", "support", "franchise",
];

const ALL_POST_ROLES = ROLE_FILTERS.slice(1);

export function ChatScreen() {
  const [me, setMe] = useState<{ id: string; email: string | null } | null>(null);
  const [myRole, setMyRole] = useState<string>("user");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<ConvId | null>(null);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [composer, setComposer] = useState("");
  const [messagesByConv, setMessagesByConv] = useState<Record<ConvId, Message[]>>({});
  const [typingByConv, setTypingByConv] = useState<Record<ConvId, string[]>>({});
  const [showNew, setShowNew] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeChannelRef = useRef<RealtimeChannel | null>(null);
  const inboxChannelRef = useRef<RealtimeChannel | null>(null);
  const typingSentAtRef = useRef<number>(0);

  // Bootstrap: current user + role
  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!mounted || !userData.user) return;
      setMe({ id: userData.user.id, email: userData.user.email ?? null });
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .order("role", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (roleRow?.role) setMyRole(roleRow.role);
    })();
    return () => { mounted = false; };
  }, []);

  // Load conversations + subscribe to inbox-level realtime
  const loadConversations = useCallback(async () => {
    const { data, error } = await supabase
      .from("chat_conversations")
      .select("id,title,module,allowed_roles,updated_at")
      .order("updated_at", { ascending: false });
    if (error) { setError(error.message); return; }
    setConversations((data ?? []) as Conversation[]);
  }, []);

  useEffect(() => {
    if (!me) return;
    loadConversations();
    const ch = supabase
      .channel(`inbox:${me.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "chat_conversations" }, () => {
        loadConversations();
      })
      .subscribe();
    inboxChannelRef.current = ch;
    return () => { supabase.removeChannel(ch); inboxChannelRef.current = null; };
  }, [me, loadConversations]);

  // Load messages + subscribe to realtime for active conversation
  useEffect(() => {
    if (!activeId || !me) return;
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("id,conversation_id,sender_id,body,created_at,metadata")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });
      if (cancelled) return;
      if (error) { setError(error.message); return; }
      setMessagesByConv((prev) => ({ ...prev, [activeId]: (data ?? []) as Message[] }));
    })();

    const ch = supabase
      .channel(`conv:${activeId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages", filter: `conversation_id=eq.${activeId}` },
        (payload) => {
          const m = payload.new as Message;
          setMessagesByConv((prev) => {
            const list = prev[activeId] ?? [];
            if (list.some((x) => x.id === m.id)) return prev;
            return { ...prev, [activeId]: [...list, m] };
          });
        },
      )
      .on("broadcast", { event: "typing" }, ({ payload }) => {
        const { userId, label } = payload as { userId: string; label: string };
        if (userId === me.id) return;
        setTypingByConv((prev) => {
          const list = prev[activeId] ?? [];
          if (list.includes(label)) return prev;
          return { ...prev, [activeId]: [...list, label] };
        });
        // clear after 3s of no signal
        window.setTimeout(() => {
          setTypingByConv((prev) => ({
            ...prev,
            [activeId]: (prev[activeId] ?? []).filter((x) => x !== label),
          }));
        }, 3000);
      })
      .subscribe();
    activeChannelRef.current = ch;

    return () => {
      cancelled = true;
      supabase.removeChannel(ch);
      activeChannelRef.current = null;
    };
  }, [activeId, me]);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) || null,
    [conversations, activeId],
  );
  const messages = active ? messagesByConv[active.id] ?? [] : [];
  const typing = active ? typingByConv[active.id] ?? [] : [];

  const canPostHere = useMemo(() => {
    if (!active) return false;
    if (myRole === "admin" || myRole === "super_admin") return true;
    return active.allowed_roles.includes(myRole);
  }, [active, myRole]);

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      if (filter !== "All" && !c.allowed_roles.includes(filter)) return false;
      if (query && !c.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [conversations, filter, query]);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, activeId, typing.length]);

  async function send() {
    const text = composer.trim();
    if (!text || !active || !me || sending) return;
    setSending(true);
    setError(null);
    const optimistic: Message = {
      id: `tmp-${crypto.randomUUID()}`,
      conversation_id: active.id,
      sender_id: me.id,
      body: text,
      created_at: new Date().toISOString(),
      metadata: { optimistic: true },
    };
    setMessagesByConv((prev) => ({ ...prev, [active.id]: [...(prev[active.id] ?? []), optimistic] }));
    setComposer("");
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({ conversation_id: active.id, sender_id: me.id, body: text })
      .select("id,conversation_id,sender_id,body,created_at,metadata")
      .single();
    setSending(false);
    if (error) {
      setMessagesByConv((prev) => ({
        ...prev,
        [active.id]: (prev[active.id] ?? []).filter((m) => m.id !== optimistic.id),
      }));
      setError(error.message.includes("row-level security")
        ? "You do not have permission to post in this channel."
        : error.message);
      setComposer(text);
      return;
    }
    setMessagesByConv((prev) => ({
      ...prev,
      [active.id]: (prev[active.id] ?? []).map((m) => (m.id === optimistic.id ? (data as Message) : m)),
    }));
  }

  function handleComposerChange(v: string) {
    setComposer(v);
    if (!active || !me || !activeChannelRef.current) return;
    const now = Date.now();
    if (now - typingSentAtRef.current < 1500) return;
    typingSentAtRef.current = now;
    activeChannelRef.current.send({
      type: "broadcast",
      event: "typing",
      payload: { userId: me.id, label: me.email ?? "Someone" },
    });
  }

  async function startConversation(title: string, allowedRoles: string[]) {
    if (!me) return;
    setShowNew(false);
    setError(null);
    const { data: conv, error: convErr } = await supabase
      .from("chat_conversations")
      .insert({ title, module: "AMS", allowed_roles: allowedRoles, created_by: me.id })
      .select("id,title,module,allowed_roles,updated_at")
      .single();
    if (convErr || !conv) { setError(convErr?.message ?? "Failed to create channel"); return; }
    const { error: partErr } = await supabase
      .from("chat_participants")
      .insert({ conversation_id: conv.id, user_id: me.id, role: myRole });
    if (partErr) { setError(partErr.message); return; }
    setConversations((c) => [conv as Conversation, ...c.filter((x) => x.id !== conv.id)]);
    setActiveId(conv.id);
  }

  if (!me) {
    return (
      <div className="gold-frame grid h-[420px] place-items-center rounded-2xl text-sm text-muted-foreground">
        <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-[#d4a14a]" /> Sign in to access secure chat</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="gold-frame relative overflow-hidden rounded-2xl">
        <div className="absolute -right-32 -top-32 h-72 w-72 rounded-full bg-[oklch(0.78_0.14_82/0.18)] blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_10px_30px_-8px_#d4a14a]">
              <MessageSquare className="h-6 w-6" strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#d4a14a]">
                <Sparkles className="h-3 w-3" /> Enterprise Communication Engine
              </div>
              <h1 className="mt-1 font-display text-3xl font-semibold text-gold-gradient md:text-4xl">
                Software Vala Chat
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Permission-aware chat with realtime delivery and role-scoped channels. Signed in as{" "}
                <span className="text-[#f5d77a]">{me.email}</span> · role{" "}
                <span className="rounded border border-gold px-1.5 text-[10px] uppercase tracking-[0.18em] text-[#f5d77a]">{myRole}</span>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Pill icon={Shield} label="RLS enforced" />
            <Pill icon={Globe} label="Realtime" />
            <Pill icon={Bot} label="Typing indicators" />
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/60 bg-red-500/10 px-4 py-2 text-xs text-red-200">
          {error}
        </div>
      )}

      {/* Layout */}
      <div className="gold-frame grid h-[calc(100vh-280px)] min-h-[640px] grid-cols-[320px_1fr_320px] overflow-hidden rounded-2xl">
        <aside className="flex min-h-0 flex-col border-r border-gold bg-[oklch(0.12_0.025_250)]">
          <div className="border-b border-gold p-4">
            <div className="flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#d4a14a]">Inbox</div>
              <button
                onClick={() => setShowNew(true)}
                className="grid h-7 w-7 place-items-center rounded-md bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_6px_18px_-6px_#d4a14a] transition-transform hover:scale-105"
                title="New conversation"
              >
                <Plus className="h-4 w-4" strokeWidth={2.6} />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-2">
              <Search className="h-3.5 w-3.5 text-[#d4a14a]" />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search channels…"
                className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          <div className="flex gap-1 overflow-x-auto border-b border-gold/60 px-3 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {ROLE_FILTERS.map((r) => (
              <button
                key={r}
                onClick={() => setFilter(r)}
                className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] transition-all ${
                  filter === r
                    ? "bg-gold-gradient text-[oklch(0.13_0.025_250)]"
                    : "text-muted-foreground hover:bg-[oklch(0.78_0.14_82/0.1)] hover:text-[#f5d77a]"
                }`}
              >{r}</button>
            ))}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <EmptyInbox onNew={() => setShowNew(true)} />
            ) : filtered.length === 0 ? (
              <EmptyFilter role={filter} onReset={() => setFilter("All")} />
            ) : (
              filtered.map((c) => (
                <ConversationRow
                  key={c.id} conv={c} active={c.id === activeId}
                  onClick={() => setActiveId(c.id)}
                />
              ))
            )}
          </div>
        </aside>

        {/* Stage */}
        <section className="flex min-h-0 flex-col bg-[oklch(0.10_0.022_250)]">
          {active ? (
            <>
              <div className="flex items-center justify-between border-b border-gold bg-[oklch(0.13_0.025_250)] px-5 py-3">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-xs font-bold text-[oklch(0.13_0.025_250)]">
                    {active.title.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-semibold text-[#f5d77a]">{active.title}</span>
                      <span className="rounded-full border border-gold px-2 py-[1px] text-[9px] uppercase tracking-[0.2em] text-[#d4a14a]">
                        {active.allowed_roles.join(" · ")}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Shield className="h-3 w-3 text-emerald-400" /> Module {active.module} · realtime enabled
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <IconBtn icon={Phone} /><IconBtn icon={Video} /><IconBtn icon={Languages} />
                  <IconBtn icon={Pin} /><IconBtn icon={Bell} /><IconBtn icon={MoreVertical} />
                </div>
              </div>

              <div ref={scrollerRef} className="relative min-h-0 flex-1 overflow-y-auto px-6 py-6">
                <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                  style={{ backgroundImage: "radial-gradient(circle at 20% 20%, #f5d77a 0%, transparent 40%), radial-gradient(circle at 80% 80%, #d4a14a 0%, transparent 40%)" }}
                />
                {messages.length === 0 ? (
                  <EmptyConversation title={active.title} />
                ) : (
                  <div className="relative space-y-3">
                    {messages.map((m) => <MessageBubble key={m.id} m={m} mine={m.sender_id === me.id} />)}
                    {typing.length > 0 && <TypingBubble labels={typing} />}
                  </div>
                )}
              </div>

              <div className="border-t border-gold bg-[oklch(0.13_0.025_250)] px-4 py-3">
                {!canPostHere ? (
                  <div className="flex items-center gap-2 rounded-xl border border-gold/60 bg-[oklch(0.16_0.03_250)] px-4 py-3 text-xs text-muted-foreground">
                    <Lock className="h-3.5 w-3.5 text-[#d4a14a]" />
                    Your role <span className="text-[#f5d77a]">{myRole}</span> is not authorized to post here. Allowed: {active.allowed_roles.join(", ")}.
                  </div>
                ) : (
                  <div className="flex items-end gap-2 rounded-2xl border border-gold bg-[oklch(0.16_0.03_250)] p-2 shadow-[inset_0_1px_0_oklch(0.78_0.14_82/0.15)] focus-within:shadow-[0_0_0_2px_oklch(0.78_0.14_82/0.35)]">
                    <IconBtn icon={Paperclip} small /><IconBtn icon={Smile} small />
                    <textarea
                      value={composer}
                      onChange={(e) => handleComposerChange(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                      placeholder={`Message ${active.title}…`}
                      rows={1}
                      className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                    <IconBtn icon={Mic} small />
                    <button
                      onClick={send}
                      disabled={!composer.trim() || sending}
                      className="grid h-9 w-9 place-items-center rounded-lg bg-gold-gradient text-[oklch(0.13_0.025_250)] shadow-[0_8px_22px_-8px_#d4a14a] transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Send className="h-4 w-4" strokeWidth={2.4} />
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <EmptyStage onNew={() => setShowNew(true)} />
          )}
        </section>

        {/* Right rail */}
        <aside className="hidden min-h-0 flex-col gap-4 overflow-y-auto border-l border-gold bg-[oklch(0.12_0.025_250)] p-4 lg:flex">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#d4a14a]">Channel</div>
          {active ? (
            <div className="space-y-3 rounded-xl border border-gold bg-[oklch(0.16_0.03_250)] p-4 text-xs">
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4a14a]">Title</div>
                <div className="mt-1 font-display text-sm text-[#f5d77a]">{active.title}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4a14a]">Allowed roles</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {active.allowed_roles.map((r) => (
                    <span key={r} className="rounded border border-gold/60 px-1.5 py-0.5 text-[10px] uppercase tracking-[0.16em] text-[#f5d77a]">{r}</span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#d4a14a]">Your access</div>
                <div className={`mt-1 text-[11px] ${canPostHere ? "text-emerald-300" : "text-red-300"}`}>
                  {canPostHere ? "Read + write" : "Read only"}
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-gold/50 bg-[oklch(0.16_0.03_250)] p-4 text-xs text-muted-foreground">
              Select or create a channel to see its permissions.
            </div>
          )}
        </aside>
      </div>

      {showNew && <NewConversationModal onClose={() => setShowNew(false)} onStart={startConversation} />}
    </div>
  );
}

// ─── Subcomponents ─────────────────────────────────────────────

function Pill({ icon: Icon, label }: { icon: typeof Shield; label: string }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f5d77a]">
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function IconBtn({ icon: Icon, small }: { icon: typeof Phone; small?: boolean }) {
  const s = small ? "h-8 w-8" : "h-9 w-9";
  return (
    <button className={`grid ${s} place-items-center rounded-lg text-muted-foreground transition-all hover:bg-[oklch(0.78_0.14_82/0.12)] hover:text-[#f5d77a]`}>
      <Icon className="h-4 w-4" />
    </button>
  );
}

function ConversationRow({ conv, active, onClick }: { conv: Conversation; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-all ${
        active ? "bg-[oklch(0.78_0.14_82/0.14)] shadow-[inset_0_0_0_1px_oklch(0.78_0.14_82/0.45)]"
          : "hover:bg-[oklch(0.78_0.14_82/0.06)]"
      }`}
    >
      <div className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-[11px] font-bold text-[oklch(0.13_0.025_250)]">
        {conv.title.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className={`truncate text-xs font-semibold ${active ? "text-[#f5d77a]" : "text-foreground"}`}>{conv.title}</span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          {conv.allowed_roles.slice(0, 3).map((r) => (
            <span key={r} className="rounded border border-gold/60 px-1.5 py-[1px] text-[9px] uppercase tracking-[0.16em] text-[#d4a14a]">{r}</span>
          ))}
        </div>
      </div>
    </button>
  );
}

function MessageBubble({ m, mine }: { m: Message; mine: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] rounded-2xl px-4 py-2.5 text-sm shadow-[0_10px_30px_-15px_rgba(0,0,0,0.7)] ${
          mine
            ? "bg-gold-gradient text-[oklch(0.13_0.025_250)] rounded-br-md"
            : "border border-gold bg-[oklch(0.16_0.03_250)] text-foreground rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap leading-relaxed">{m.body}</div>
        <div className={`mt-1 flex items-center justify-end gap-1 text-[10px] ${mine ? "text-[oklch(0.13_0.025_250)]/70" : "text-muted-foreground"}`}>
          <span>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
          {mine && <CheckCheck className="h-3 w-3" />}
        </div>
      </div>
    </div>
  );
}

function TypingBubble({ labels }: { labels: string[] }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-gold bg-[oklch(0.16_0.03_250)] px-4 py-2.5 text-xs text-muted-foreground">
        <span className="truncate">{labels.join(", ")} typing</span>
        <span className="inline-flex gap-0.5">
          <Dot delay="0ms" /><Dot delay="150ms" /><Dot delay="300ms" />
        </span>
      </div>
    </div>
  );
}
function Dot({ delay }: { delay: string }) {
  return <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-[#f5d77a]" style={{ animationDelay: delay }} />;
}

function EmptyInbox({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-2xl border border-gold bg-[oklch(0.16_0.03_250)]">
        <Inbox className="h-7 w-7 text-[#f5d77a]" />
      </div>
      <div className="mt-4 font-display text-sm font-semibold text-[#f5d77a]">No channels yet</div>
      <p className="mt-1 max-w-xs text-[11px] text-muted-foreground">Create a role-scoped channel — only participants with matching roles can post.</p>
      <button onClick={onNew} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.13_0.025_250)]">
        <Plus className="h-3 w-3" /> New Channel
      </button>
    </div>
  );
}

function EmptyFilter({ role, onReset }: { role: string; onReset: () => void }) {
  return (
    <div className="px-4 py-8 text-center text-[11px] text-muted-foreground">
      No channels for role <span className="text-[#f5d77a]">{role}</span>.
      <button onClick={onReset} className="ml-2 underline hover:text-[#f5d77a]">Reset</button>
    </div>
  );
}

function EmptyStage({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <MessageSquare className="h-10 w-10 text-[#d4a14a]" />
      <div className="mt-3 font-display text-sm text-[#f5d77a]">Select a channel to start chatting</div>
      <button onClick={onNew} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.13_0.025_250)]">
        <Plus className="h-3 w-3" /> New Channel
      </button>
    </div>
  );
}

function EmptyConversation({ title }: { title: string }) {
  return (
    <div className="grid h-full place-items-center text-center text-xs text-muted-foreground">
      <div>
        <Shield className="mx-auto h-6 w-6 text-emerald-400" />
        <div className="mt-2">Secure channel <span className="text-[#f5d77a]">{title}</span> is ready.</div>
        <div className="text-[10px]">Type a message to get started — realtime delivery is on.</div>
      </div>
    </div>
  );
}

function NewConversationModal({
  onClose,
  onStart,
}: {
  onClose: () => void;
  onStart: (title: string, allowedRoles: string[]) => void;
}) {
  const [title, setTitle] = useState("");
  const [roles, setRoles] = useState<string[]>(["user", "admin", "super_admin"]);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 30); }, []);
  const valid = title.trim().length >= 2 && roles.length > 0;

  function toggle(r: string) {
    setRoles((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[oklch(0.08_0.02_250/0.7)] p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md overflow-hidden rounded-2xl border border-gold bg-[oklch(0.13_0.025_250)] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between border-b border-gold px-5 py-4">
          <div className="flex items-center gap-2">
            <IdCard className="h-4 w-4 text-[#f5d77a]" />
            <div className="font-display text-sm font-semibold text-gold-gradient">Create a role-scoped channel</div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-[#f5d77a]"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#d4a14a]">Channel Title</label>
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-gold bg-[oklch(0.16_0.03_250)] px-3 py-2">
              <Hash className="h-3.5 w-3.5 text-[#d4a14a]" />
              <input
                ref={inputRef} value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Vendor Ops, Support Room, Founders"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-[0.22em] text-[#d4a14a]">Roles allowed to post</label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {ALL_POST_ROLES.map((r) => (
                <button key={r} onClick={() => toggle(r)} className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] transition-all ${
                  roles.includes(r) ? "bg-gold-gradient text-[oklch(0.13_0.025_250)]"
                  : "border border-gold/60 text-muted-foreground hover:text-[#f5d77a]"
                }`}>{r}</button>
              ))}
            </div>
            <p className="mt-1.5 text-[10px] text-muted-foreground">Members outside these roles can read but cannot post. Admins always can.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 border-t border-gold bg-[oklch(0.12_0.025_250)] px-5 py-3">
          <button onClick={onClose} className="rounded-lg px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground">Cancel</button>
          <button
            disabled={!valid}
            onClick={() => onStart(title.trim(), roles)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gold-gradient px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[oklch(0.13_0.025_250)] shadow-[0_8px_22px_-8px_#d4a14a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Create Channel <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
