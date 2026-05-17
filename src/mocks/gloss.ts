
import type { GlossData } from "@/app/types/gloss";

export const mockGlosses: GlossData[] = [
    {
        glossId: "g_1",
        roomId: "room_1",
        salonId: "salon_1",
        userId: "user_1",
        content: "Hello world",
        reports: [],
        postedAt: new Date().toISOString(),
        userName: "Mai",
        roomName: "Room Alpha",
        salonName: "salon_1",
        replyCount: 0,
        fondCount: 3,
    },
];