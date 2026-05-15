import { isYouTube, isMusic } from "./validator";
import { extractMusicData, extractYouTubeId } from "./util";
import type { TurnTableData } from "@/app/types/turntable";
import { nanoid } from "nanoid";

export const parseTurnTable = (
    url: string,
    roomId: string
): TurnTableData => {
    if (isYouTube(url)) {
        const videoId = extractYouTubeId(url);

        return {
            id: nanoid(),
            roomId,
            type: "video",
            video: {
                videoId,
                title: "Unknown Title",
                channelName: "Unknown Channel",
                url,
            },
        };
    }

    if (isMusic(url)) {
        return {
            id: nanoid(),
            roomId,
            type: "music",
            music: extractMusicData(url),
        };
    }

    throw new Error("invalid url");
};