
import type { TurnTableData } from "@/app/types/turntable";

export const mockTurntables: TurnTableData[] = [
    {
        id: "tt_1",
        roomId: "room_1",
        type: "video",
        video: {
            videoId: "abc123",
            title: "Sample Video",
            channelName: "Test Channel",
            url: "https://youtube.com",
        },
    },
    {
        id: "tt_2",
        roomId: "room_1",
        type: "music",
        music: {
            title: "Sample Song",
            artist: "Artist",
            cover: "https://example.com/cover.jpg",
            service: "spotify",
            url: "https://spotify.com",
        },
    },
];