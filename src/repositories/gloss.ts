import type { GlossData } from "@/app/types";
import { mockGlosses } from "@/mocks/gloss";

const FOND_UPDATES_KEY = "gloss-fond-updates";

type GlossFondUpdate = {
    fondCount: number;
};

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

const getFondUpdates = (): Record<string, GlossFondUpdate> => {
    if (typeof window === "undefined") return {};

    const saved = localStorage.getItem(FOND_UPDATES_KEY);
    if (!saved) return {};

    try {
        return JSON.parse(saved);
    } catch {
        return {};
    }
};

const saveFondUpdates = (updates: Record<string, GlossFondUpdate>) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(FOND_UPDATES_KEY, JSON.stringify(updates));
};

const applyFondUpdates = (glosses: GlossData[]) => {
    const fondUpdates = getFondUpdates();
    return glosses.map((gloss) => {
        const update = fondUpdates[gloss.glossId];
        return update ? { ...gloss, ...update } : gloss;
    });
};

export const getGlosses = async (): Promise<GlossData[]> => {
    const glosses = [...getPostedGlosses(), ...mockGlosses];
    return applyFondUpdates(glosses);
};

export const updateGlossFond = async (
    glossId: string,
    delta = 1
): Promise<void> => {
    if (typeof window === "undefined") return;

    const glosses = await getGlosses();
    const gloss = glosses.find((gloss) => gloss.glossId === glossId);
    if (!gloss) return;

    const updates = getFondUpdates();
    const previousFondCount = updates[glossId]?.fondCount ?? gloss.fondCount;
    updates[glossId] = {
        fondCount: previousFondCount + delta,
    };

    saveFondUpdates(updates);
};
