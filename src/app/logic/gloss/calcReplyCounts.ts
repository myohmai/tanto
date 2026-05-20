import { GlossData } from "@/app/types";

export const calcReplyCounts = (glosses: GlossData[]) => {
    const countMap: Record<string, number> = {};

    glosses.forEach((gloss) => {
        if (!gloss.replyToGlossId) return;

        countMap[gloss.replyToGlossId] =
            (countMap[gloss.replyToGlossId] ?? 0) + 1;
    });

    return glosses.map((gloss) => ({
        ...gloss,
        replyCount: countMap[gloss.glossId] ?? 0,
    }));
};