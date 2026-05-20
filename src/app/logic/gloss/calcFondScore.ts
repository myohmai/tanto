import type { GlossData } from "@/app/types/gloss";

export const calcFondScore = (gloss: GlossData) => {
    const fondCount = gloss.fondCount;
    const reportCount = gloss.reports?.length ?? 0;

    return Math.max(0, fondCount - reportCount * 5);
};