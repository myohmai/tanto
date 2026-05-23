
import type { RoomData } from "@/app/types/room";

export const mockRooms: RoomData[] = [
    {
        roomId: "room_1",
        roomIconUrl: "https://picsum.photos/500",
        roomName: "Room Alpha",
        roomInformation: "This is a sample room",
        tags: ["music", "video"],
        roomRule: "Be kind",
        roomMemberIni: {
            initialName: "A",
            iconUrl: null,
        },
        roomMemberCount: 10,
        roomVisibility: "public",
        roomHost: {
            userId: "user_1",
            iconUrl: "https://picsum.photos/200",
            userName: "Mai",
            subIcon: {
                type: "fond",
                value: "blue",
            },
        },
        hostCreateSalon: false,
        entityIds: [],
        isOpenRoom: false,
        reports: [],
        glossCount: 120,
        recentGlossCount: 5,
    },
    {
        roomId: "room_2",
        roomIconUrl: "https://picsum.photos/500",
        roomName: "Room Beta",
        roomInformation: "This is another sample room",
        tags: ["art", "photography"],
        roomRule: "Be respectful",
        roomMemberIni: {
            initialName: "B",
            iconUrl: null,
        },
        roomMemberCount: 15,
        roomVisibility: "public",
        roomHost: {
            userId: "user_1",
            iconUrl: "https://picsum.photos/200",
            userName: "Sara",
            subIcon: {
                type: "fond",
                value: "pink",
            },
        },
        hostCreateSalon: false,
        entityIds: [],
        isOpenRoom: false,
        reports: [],
        glossCount: 120,
        recentGlossCount: 5,
    },
];
