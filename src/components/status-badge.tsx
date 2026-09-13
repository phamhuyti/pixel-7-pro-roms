import { Badge } from "@/components/ui/badge";
import { statusLabels } from "@/data/labels";
import type { RomStatus } from "@/data/types";
import { cn } from "cn";

const statusClass: Record<RomStatus, string> = {
  stock:
    "border-transparent bg-sky-500/15 text-sky-800 dark:bg-sky-400/15 dark:text-sky-200",
  active:
    "border-transparent bg-teal-500/15 text-teal-800 dark:bg-teal-400/15 dark:text-teal-200",
  stale:
    "border-transparent bg-amber-500/15 text-amber-900 dark:bg-amber-400/15 dark:text-amber-200",
  discontinued:
    "border-transparent bg-rose-500/12 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200",
};

export function StatusBadge({
  status,
  className,
}: {
  status: RomStatus;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      className={cn(statusClass[status], className)}
    >
      {statusLabels[status]}
    </Badge>
  );
}
