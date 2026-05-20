import type { FondLevel } from "@/app/components/icons/types";
import { calcFondScore } from "./calcFondScore";
import type { GlossData } from "@/app/types/gloss";

export const calcFondLevel = (gloss: GlossData): FondLevel => {
    const score = calcFondScore(gloss);

    if (score >= 1000) return '500';
    if (score >= 800) return '400';
    if (score >= 600) return '300';
    if (score >= 400) return '200';
    return '100';
};