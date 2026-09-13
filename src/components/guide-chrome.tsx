import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function GuideChrome({
  eyebrow,
  title,
  lede,
  officialHref,
  officialLabel,
  extraActions,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  officialHref: string;
  officialLabel: string;
  extraActions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <p className="text-sm text-muted-foreground">
        <Link href="/cai-dat" className="hover:text-foreground">
          ← Cài đặt Pixel 7 Pro
        </Link>
      </p>
      <p className="mt-5 font-mono text-xs tracking-[0.18em] text-teal-300 uppercase">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-heading text-3xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{lede}</p>

      <Alert className="mt-6 border-amber-500/30 bg-amber-500/8">
        <ShieldAlert className="text-amber-400" />
        <AlertTitle>Wiki official thắng trang này nếu lệch.</AlertTitle>
        <AlertDescription>
          Đây là bản tiếng Việt theo kênh official tại snapshot catalog. Lệnh,
          tên file và thứ tự có thể đổi. Đọc trang dự án trước khi flash.
        </AlertDescription>
      </Alert>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button
          variant="outline"
          render={<a href={officialHref} target="_blank" rel="noreferrer" />}
        >
          {officialLabel}
        </Button>
        {extraActions}
      </div>

      {children}
    </article>
  );
}

export function GuideSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-heading text-lg font-semibold">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function BulletList({
  items,
  muted = false,
}: {
  items: string[];
  muted?: boolean;
}) {
  return (
    <ul
      className={`list-disc space-y-1.5 pl-5 text-sm leading-relaxed ${
        muted ? "text-muted-foreground" : ""
      }`}
    >
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
