"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CommandBlock({ commands }: { commands: string[] }) {
  const [copied, setCopied] = useState(false);
  const text = commands.join("\n");

  function fallbackCopy() {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.left = "-9999px";
    document.body.appendChild(field);
    field.select();
    const ok = document.execCommand("copy");
    field.remove();
    if (!ok) throw new Error("copy failed");
  }

  async function copy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallbackCopy();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      try {
        fallbackCopy();
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {
        setCopied(false);
      }
    }
  }

  return (
    <div className="relative mt-3 overflow-hidden rounded-lg border border-border bg-muted/40">
      <Button
        type="button"
        size="xs"
        variant="ghost"
        className="absolute top-1.5 right-1.5"
        onClick={copy}
        aria-label="Sao chép lệnh"
      >
        {copied ? <Check /> : <Copy />}
        {copied ? "Đã chép" : "Chép"}
      </Button>
      <pre className="overflow-x-auto px-3 py-3 pr-24 font-mono text-[13px] leading-relaxed">
        <code>{text}</code>
      </pre>
    </div>
  );
}
