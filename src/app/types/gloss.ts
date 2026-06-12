import { MediaItem, MediaLabelType } from "@/app/types/media"
import { Topic } from "@/app/types/topic"
import type { Report } from "@/app/types/report"

export type GlossData = {
    glossId: string;
    
    roomId: string;
    salonId: string | undefined;
    userId: string | undefined;

    content: string;

    media?: {
        source: MediaItem[];
        type: MediaLabelType | null;
    }

    mediaEmbed?: {
        url: string;
    }

    reports?: Report[];

    revaluation?: {
        yesCount: number;
        noCount: number;
    }

    topic?: Topic;

    postedAt: string;
    userName: string | undefined | null;
    salonName?: string;
    roomName: string;

    replyCount: number;
    fondCount: number;

    replyToGlossId?: string;

    downloadUrl?: string;
}