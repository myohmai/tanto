import { getGlosses } from "@/repositories/gloss";
import { getBlocksByUser } from "@/repositories/block";
import { getCurrentUserId } from "@/repositories/currentUser";
import { filterGlosses } from "./filterGloss";

// fondCount / replyCount はDB view (gloss_feed) が計算済み
export const getProcessedGlosses = async () => {
    const userId = await getCurrentUserId();
    const [glosses, blocks] = await Promise.all([
        getGlosses(),
        getBlocksByUser(userId),
    ]);

    return filterGlosses(glosses, blocks);
};