import { getAllFonds } from "@/repositories/fond";
import { calcReplyCounts } from "./calcReplyCounts";
import { calcFondCount } from "./calcFondCount";
import { getGlosses } from "@/repositories/gloss";
import { getBlocksByUser } from "@/repositories/block";
import { getCurrentUserId } from "@/repositories/currentUser";
import { filterGlosses } from "./filterGloss";

export const getProcessedGlosses = async () => {
    const [glosses, fonds, userId] = await Promise.all([
        getGlosses(),
        getAllFonds(),
        getCurrentUserId(),
    ]);

    const withFond = calcFondCount(glosses, fonds);
    const withReply = calcReplyCounts(withFond);

    const [blocks] = await Promise.all([
        getBlocksByUser(userId),
    ]);

    const filtered = filterGlosses(withReply, blocks);

    return filtered;
};