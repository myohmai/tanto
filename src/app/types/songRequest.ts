import type { MusicService } from './turntable';

export type SongRequestStatus = 'pending' | 'approved' | 'rejected' | 'timeout';
export type SongRequestType = 'music' | 'video';

export type SongRequestMetadata = {
    title: string;
    thumbnail?: string;
    // music
    artist?: string;
    service?: MusicService;
    // video
    channelName?: string;
    videoId?: string;
};

export type SongRequest = {
    id: string;
    roomId: string;
    requestedBy: string;
    url: string;
    type: SongRequestType;
    metadata: SongRequestMetadata;
    status: SongRequestStatus;
    createdAt: string;
    expiresAt: string;
};

export type Vote = {
    id: string;
    requestId: string;
    userId: string;
    approved: boolean;
    votedAt: string;
};

export type SongRequestWithVotes = SongRequest & {
    votes: Vote[];
    activeMembers: number;
};
