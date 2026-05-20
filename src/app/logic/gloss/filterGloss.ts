import type { GlossData } from "@/app/types/gloss";
import type { Block } from "@/repositories/block";

export const filterGlosses = (
    glosses: GlossData[],
    blocks: Block[],
) => {
    return glosses.filter(gloss => {
        // Block（ユーザー）
        if (blocks.some(b => b.targetUserId === gloss.userId)) {
            return false;
        }

        return true;
    });
};