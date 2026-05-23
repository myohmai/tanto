type TurnTableType = "video" | "music";

export type MusicService = "youtube" | "spotify" | "appleMusic";

export type TurnTableData = {
    id: string;
    roomId: string;
    type: TurnTableType;

    video?: {
        videoId: string;
        title: string;
        channelName: string;
        url: string;
    };

    music?: {
        title: string;
        artist: string;
        cover: string | null;
        service: MusicService;
        url: string;
    };
};