import { FlashSteps } from "@/components/flash-steps";
import { BulletList, GuideSection } from "@/components/guide-chrome";
import { Badge } from "@/components/ui/badge";
import type { SwitchGuide } from "@/data/types";

export function SwitchGuideSections({ guide }: { guide: SwitchGuide }) {
  return (
    <div id="tu-custom-rom" className="scroll-mt-20">
      <GuideSection title="Đang ở custom ROM khác">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {guide.summary}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {guide.stockFirst && (
            <Badge variant="secondary">Nên / phải về stock trước</Badge>
          )}
          {guide.cleanRequired && (
            <Badge variant="outline">Clean flash khi đổi ROM</Badge>
          )}
          {guide.dirtyAllowed && (
            <Badge variant="outline">Dirty flash nếu đã ở đúng ROM này</Badge>
          )}
        </div>
        <div className="mt-5">
          <FlashSteps steps={guide.steps} />
        </div>
        {guide.notes.length > 0 && (
          <div className="mt-4">
            <BulletList items={guide.notes} muted />
          </div>
        )}
      </GuideSection>
    </div>
  );
}
