import { BiasColor } from "@/app/components/icons";

export type SalonIcon =
    | { type: 'emoji'; value: string } 
    | { type: 'fond'; value: BiasColor };

export type SalonData = {
    salonId?: string;
    roomId: string;
    salonName: string;
    salonIcon: SalonIcon;
    isTopicBox: boolean;
    isPinned: boolean;
}