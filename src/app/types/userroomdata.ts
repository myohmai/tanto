import { UserSubIcon } from '@/app/components/custom-icon/UserCustomIcon'

export type UserRoomData = {
    userId: string;
    roomId: string;
    roomName: string; //後で消す
    iconUrl?: string;
    subIcon?: UserSubIcon | null;
    userName: string;
}