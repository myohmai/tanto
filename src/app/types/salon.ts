import { BiasColor } from "@/app/components/icons";

export type SalonIcon =
    | { type: 'emoji'; value: string } 
    | { type: 'fond'; value: BiasColor };

export type SalonData = {
    salonName: string;
    salonIcon: SalonIcon;
    isTopicBox: boolean;
}