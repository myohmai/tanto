import { UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { QuizeList } from "@/app/components/form/SetQuizes";
import { Report } from '@/app/types/report'

export type RoomData = {
    roomId: string;

    roomBannerUrl?: string | null;
    roomIconUrl?: string | null;
    roomName: string;

    roomInformation: string;
    tags: string[];

    roomRule: string;

    roomMemberIni: {
        iconUrl?: string | null | undefined;
        initialName: string | null | undefined;
    }

    roomMemberCount: number;

    roomVisibility: "public" | "private";

    roomEntrySetting?: "quiz" | "keyword";

    roomKeyWord?: string;
    roomKeyWordHint?: string;

    roomQuiz?: QuizeList[] | null;
    roomQuizScore?: number;

    roomHost?: {
        userId: string;
        iconUrl?: string | null;
        userName: string;
        subIcon?: UserSubIcon | null;
    }

    hostCreateSalon: boolean;

    entityIds: string[];

    reports: Report[]

    // 後で分離
    glossCount: number;
    recentGlossCount: number;
}