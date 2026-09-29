import type { RoomData } from "@/app/types/room";
import type { GlossData } from "@/app/types/gloss";
import type { UserRoomData } from "@/app/types/userRoomData";

export const calcRoomMeta = (
    rooms: RoomData[],
    glosses: GlossData[],
    userRooms: UserRoomData[]
) => {
        return rooms.map(room => {
        const roomGlosses = glosses.filter(g => g.roomId === room.roomId);

        const members = userRooms.filter(r => r.roomId === room.roomId);

        const hasHost = !!room.roomHost?.userId;

        const hasHostInUserRoom = members.some(
            r => r.userId === room.roomHost?.userId
        );

        // user_rooms は RLS で自分の行しか読めないため、ここで数えた値は実際より小さくなる。
        // トリガーで管理している rooms.member_count を優先する。
        const roomMemberCount = Math.max(
            room.roomMemberCount,
            members.length + (hasHost && !hasHostInUserRoom ? 1 : 0),
        );

        return {
            ...room,
            roomMemberCount,
            glossCount: roomGlosses.length,
            latestPostedAt: roomGlosses
                .sort((a, b) => Number(b.postedAt) - Number(a.postedAt))[0]?.postedAt ?? "",
            latestImages: roomGlosses
                .flatMap(g => g.media?.source ?? [])
                .filter(m => m.type === "image")
                .slice(0, 3)
                .map(m => m.url),
        };
    });
};