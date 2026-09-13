import { InstallHub } from "@/components/install-hub";
import { DEVICE_NAME } from "@/data/labels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cài đặt",
  description: `Mở khóa bootloader và flash custom ROM còn duy trì trên ${DEVICE_NAME}. Theo kênh official, không hướng dẫn root hay bypass Integrity.`,
};

export default function InstallPage() {
  return <InstallHub />;
}
