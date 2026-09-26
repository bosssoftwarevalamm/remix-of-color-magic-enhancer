import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { SWITCH_GROUPS, type SwitchTarget } from "./role-dashboards";

export type AiSuggestion = { target: SwitchTarget; group: string; reason: string };
export type AiSuggestResult =
  | { ok: true; suggestions: AiSuggestion[] }
  | { ok: false; reason: string };

const CATALOG = SWITCH_GROUPS.flatMap((g) => g.items.map((item) => ({ group: g.group, item })));

export const suggestDashboard = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ need: z.string().trim().min(2).max(1000) }).parse(d))
  .handler(async ({ data }): Promise<AiSuggestResult> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { ok: false, reason: "AI is not configured." };

    const list = CATALOG.map((c, i) => `${i}. ${c.item.label} [${c.group}]`).join("\n");
    const instructions = `You route a Super Admin to the best dashboard in a software platform.
Available dashboards (index. label [group]):
${list}

The user may write in Hindi, Hinglish or English. Pick the 1 to 3 most suitable dashboards, best first.
Reply ONLY with JSON: {"picks":[{"index":number,"reason":"one short sentence in the user's language"}]}`;

    let res: Response;
    try {
      res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "Lovable-API-Key": apiKey,
          "X-Lovable-AIG-SDK": "fetch",
        },
        body: JSON.stringify({
          model: "openai/gpt-6-astra",
          instructions,
          input: data.need,
          reasoning: { effort: "low" },
          store: false,
          stream: true,
        }),
      });
    } catch {
      return { ok: false, reason: "Could not reach the AI service." };
    }

    if (!res.ok || !res.body) {
      const body = await res.text().catch(() => "");
      let msg = "";
      try { msg = JSON.parse(body)?.error?.message ?? JSON.parse(body)?.message ?? ""; } catch {}
      if (res.status === 429) return { ok: false, reason: "Too many requests — please try again shortly." };
      if (res.status === 402) return { ok: false, reason: msg || "AI credits are exhausted." };
      return { ok: false, reason: msg || `AI request failed (${res.status}).` };
    }

    // Consume SSE stream server-side and accumulate text.
    const reader = res.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let text = "";
    let failure = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let idx;
      while ((idx = buf.indexOf("\n\n")) !== -1) {
        const frame = buf.slice(0, idx);
        buf = buf.slice(idx + 2);
        for (const line of frame.split("\n")) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload);
            if (ev.type === "response.output_text.delta") text += ev.delta ?? "";
            else if (ev.type === "response.failed" || ev.type === "error")
              failure = ev.response?.error?.message ?? ev.message ?? "AI request failed.";
            else if (ev.type === "response.refusal.delta") failure = "The AI declined this request.";
          } catch {}
        }
      }
    }
    if (failure) return { ok: false, reason: failure };

    const match = text.match(/\{[\s\S]*\}/);
    let picks: { index: number; reason: string }[] = [];
    try { picks = JSON.parse(match?.[0] ?? "{}").picks ?? []; } catch {}
    const suggestions = picks
      .filter((p) => Number.isInteger(p.index) && CATALOG[p.index])
      .slice(0, 3)
      .map((p) => ({ target: CATALOG[p.index].item, group: CATALOG[p.index].group, reason: String(p.reason ?? "") }));
    if (!suggestions.length) return { ok: false, reason: "No matching dashboard found — try describing it differently." };
    return { ok: true, suggestions };
  });
