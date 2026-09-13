import { UnlockGuideView } from "@/components/unlock-guide-view";
import { DEVICE_NAME } from "@/data/labels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mở khóa bootloader",
  description: `Hướng dẫn unlock bootloader ${DEVICE_NAME} (cheetah) bằng fastboot flashing unlock. Xóa dữ liệu.`,
};

export default function UnlockPage() {
  return <UnlockGuideView />;
}
