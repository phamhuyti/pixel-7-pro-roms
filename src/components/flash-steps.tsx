import { CommandBlock } from "@/components/command-block";
import type { FlashStep } from "@/data/types";

export function FlashSteps({ steps }: { steps: FlashStep[] }) {
  return (
    <ol className="space-y-5">
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="rounded-xl border border-border bg-card p-4"
        >
          <p className="font-mono text-[11px] tracking-wide text-teal-300 uppercase">
            Bước {index + 1}
          </p>
          <h3 className="mt-1 font-heading text-base font-semibold">
            {step.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {step.body}
          </p>
          {step.commands && step.commands.length > 0 && (
            <CommandBlock commands={step.commands} />
          )}
          {step.note && (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {step.note}
            </p>
          )}
        </li>
      ))}
    </ol>
  );
}
