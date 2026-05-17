
import { SalonData } from "@/app/types/salon";

export const mockSalons: SalonData[] = [
    {
        salonId: "salon_1",
        roomId: "room_1",
        salonName: "Main Topic",
        salonIcon: {
            type: "emoji",
            value: "💬",
        },
        isTopicBox: true,
        isPinned: true,
    },
    {
        salonId: "salon_2",
        roomId: "room_2",
        salonName: "Beta Lounge",
        salonIcon: {
            type: "emoji",
            value: "🌙",
        },
        isTopicBox: true,
        isPinned: false,
    },
];