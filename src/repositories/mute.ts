export type Mute = {
    userId: string;
    roomId?: string;
    salonId?: string;
};

const KEY = "mutes";

const getMutes = (): Mute[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
};

const saveMutes = (mutes: Mute[]) => {
    localStorage.setItem(KEY, JSON.stringify(mutes));
};

export const toggleMute = (mute: Mute) => {
    const mutes = getMutes();

    const exists = mutes.find(
        m =>
            m.userId === mute.userId &&
            m.roomId === mute.roomId &&
            m.salonId === mute.salonId
    );

    const updated = exists
        ? mutes.filter(m => m !== exists)
        : [...mutes, mute];

    saveMutes(updated);
};

export const getMutesByUser = async (userId: string) => {
    return getMutes().filter(m => m.userId === userId);
};