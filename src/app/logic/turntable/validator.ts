export const isYouTube = (url: string) => {
    try {
        const hostname = new URL(url).hostname;
        return (
            hostname.includes("youtube.com") ||
            hostname === "youtu.be"
        );
    } catch {
        return false;
    }
};

export const isMusic = (url: string) => {
    try {
        const hostname = new URL(url).hostname;
        return (
            hostname.includes("spotify.com") ||
            hostname.includes("music.apple.com")
        );
    } catch {
        return false;
    }
};