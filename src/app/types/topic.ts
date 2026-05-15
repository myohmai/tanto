import { MediaLabelType, MediaItem } from "@/app/types/media";

export type Topic = {
    topicId: string;

    roomId: string;
    salonId: string;
    userId: string;

    topicContent: string;

    media?: {
        source: MediaItem[];
        type: MediaLabelType;
    }
    
    mediaEmbed?: {
        url: string;
    }

    postedAt: string;
}