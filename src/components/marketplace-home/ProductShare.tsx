import { Copy, Facebook, Instagram, Linkedin, Mail, MessageCircle, Send, Share2, Twitter } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function ProductShare({ name, description, url, id }: { name: string; description: string; url: string; id: string }) {
  const shareUrl = () => new URL(url && url !== "#" ? url : `/#product-${encodeURIComponent(id)}`, window.location.origin).href;
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      toast.success("URL copied!");
      return true;
    } catch {
      toast.error("Couldn't copy URL. Please allow clipboard access and try again.");
      return false;
    }
  };
  const openShare = (platform: string) => {
    const link = encodeURIComponent(shareUrl());
    const text = encodeURIComponent(`${name} — ${description}`);
    const targets: Record<string, string> = {
      Facebook: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
      WhatsApp: `https://wa.me/?text=${text}%20${link}`,
      Telegram: `https://t.me/share/url?url=${link}&text=${text}`,
      "X / Twitter": `https://twitter.com/intent/tweet?url=${link}&text=${encodeURIComponent(name)}`,
      LinkedIn: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
      Email: `mailto:?subject=${encodeURIComponent(name)}&body=${text}%0A%0A${link}`,
    };
    const target = targets[platform];
    if (!target) return;
    if (platform === "Email") window.location.href = target;
    else window.open(target, "_blank", "noopener,noreferrer");
  };
  const instagram = async () => {
    // Instagram has no web URL-sharing endpoint. Use the device share sheet
    // when supported; otherwise copy the link for pasting into Instagram.
    if (navigator.share) {
      try { await navigator.share({ title: name, text: description, url: shareUrl() }); }
      catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        if (await copyUrl()) toast.info("Paste the copied link in Instagram.");
      }
    } else if (await copyUrl()) toast.info("Paste the copied link in an Instagram message or story.");
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button data-no-3d className="sv-btn sv-btn-hero-glass sv-product-share" aria-label={`Share ${name}`} title="Share">
          <Share2 className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="sv-share-menu w-52" onClick={(event) => event.stopPropagation()}>
        <DropdownMenuItem onSelect={() => void instagram()}><Instagram />Instagram</DropdownMenuItem>
        {([
          ["Facebook", Facebook], ["WhatsApp", MessageCircle], ["Telegram", Send],
          ["X / Twitter", Twitter], ["LinkedIn", Linkedin], ["Email", Mail],
        ] as const).map(([label, Icon]) => (
          <DropdownMenuItem key={label} onSelect={() => openShare(label)}><Icon />{label}</DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void copyUrl()}><Copy />Copy URL</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}