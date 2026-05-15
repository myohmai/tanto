import type { MusicService } from "@/app/types/turntable";

const getService = (url: string): MusicService => {
    if (url.includes("spotify")) return "spotify";
    if (url.includes("music.apple.com")) return "appleMusic";
    return "youtube";
};

export const extractYouTubeId = (url: string): string => {
    const u = new URL(url);

    if (u.hostname === "youtu.be") {
        return u.pathname.replace("/", "");
    }

    return u.searchParams.get("v") || "";
};

export const extractMusicData = (url: string) => {
    return {
        title: "Unknown Title",
        artist: "Unknown Artist",
        cover: "",
        service: getService(url),
        url,
    };
};