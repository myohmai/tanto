import type { UserRoomData } from "@/app/types";

export const mockUserRoomData: UserRoomData[] = [
    {
        userId: "user_1",
        roomId: "room_1",
        roomName: "Room Alpha",
        iconUrl: "https://picsum.photos/200",
        subIcon: {
            type: "fond",
            value: "blue",
        },
        userName: "Mai",
    },
    {
        userId: "user_1",
        roomId: "room_2",
        roomName: "Room Beta",
        iconUrl: "https://picsum.photos/200",
        subIcon: {
            type: "fond",
            value: "pink",
        },
        userName: "Sara",
    },
];