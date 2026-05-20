export type Block = {
    userId: string;
    targetUserId: string;
};

const KEY = "blocks";

const getBlocks = (): Block[] => {
    if (typeof window === "undefined") return [];
    const saved = localStorage.getItem(KEY);
    return saved ? JSON.parse(saved) : [];
};

const saveBlocks = (blocks: Block[]) => {
    localStorage.setItem(KEY, JSON.stringify(blocks));
};

export const toggleBlock = (targetUserId: string, userId: string) => {
    const blocks = getBlocks();

    const exists = blocks.find(
        b => b.userId === userId && b.targetUserId === targetUserId
    );

    const updated = exists
        ? blocks.filter(
            b => !(b.userId === userId && b.targetUserId === targetUserId)
        )
        : [...blocks, { userId, targetUserId }];

    saveBlocks(updated);
};

export const getBlocksByUser = async (userId: string) => {
    return getBlocks().filter(b => b.userId === userId);
};