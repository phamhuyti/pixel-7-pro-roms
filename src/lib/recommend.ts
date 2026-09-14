import type { Rom } from "@/data/types";

export type Recommendation = {
  rom: Rom;
  score: number;
  reasons: string[];
};
