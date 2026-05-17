import { Topic } from "@/app/types";
import { mockTopics } from "@/mocks/topic";

const getPostedTopics = (): Topic[] => {
    if (typeof window === "undefined") return [];

    const saved = localStorage.getItem("posted-topics");
    if (!saved) return [];

    try {
        return JSON.parse(saved);
    } catch {
        return [];
    }
};

export const getTopics = async (): Promise<Topic[]> => {
    return [...getPostedTopics(), ...mockTopics];
};
