import { UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { QuizeList } from "@/app/components/form/SetQuizes";

export type RoomData = {
    roomBannerUrl?: string | null;
    roomIconUrl?: string | null;
    roomName: string;

    roomInformation: string;
    tags: string[];

    roomRule: string;

    roomMemberIni: {
        iconUrl?: string | null;
        initialName: string;
    }

    roomVisibility: "public" | "private";

    roomEntrySetting?: "quiz" | "keyword";

    roomKeyWord?: string;
    roomKeyWordHint?: string;

    roomQuiz?: QuizeList[] | null;
    roomQuizScore?: number;

    roomHost: {
        iconUrl?: string | null;
        userName: string;
        subIcon?: UserSubIcon | null;
    }

    hostCreateSalon: boolean;
}