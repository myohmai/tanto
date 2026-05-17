import type { UserSubIcon } from '@/app/components/custom-icon/UserCustomIcon'

export type UserRoomData = {
    userId: string;
    roomId: string;
    roomName: string;
    iconUrl?: string;
    subIcon?: UserSubIcon | null;
    userName: string;
}