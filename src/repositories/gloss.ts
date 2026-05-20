import type { GlossData } from "@/app/types";
import { mockGlosses } from "@/mocks/gloss";

const getPostedGlosses = (): GlossData[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("posted-glosses");
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

export const getGlosses = async (): Promise<GlossData[]> => {
    const posted = getPostedGlosses();
    return [...posted, ...mockGlosses];
};