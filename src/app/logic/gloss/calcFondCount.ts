import type { GlossData } from "@/app/types/gloss";
import type { Fond } from "@/app/types/fond";

export const calcFondCount = (
    glosses: GlossData[],
    fonds: Fond[]
): GlossData[] => {

    const map = new Map<string, number>();

    fonds.forEach(f => {
        map.set(f.glossId, (map.get(f.glossId) ?? 0) + 1);
    });

    return glosses.map(gloss => ({
        ...gloss,
        fondCount: map.get(gloss.glossId) ?? 0,
    }));
};