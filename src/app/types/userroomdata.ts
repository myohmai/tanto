import type { UserSubIcon } from '@/app/components/custom-icon/UserCustomIcon'

export type UserRoomData = {
    userId: string;
    roomId: string;
    roomName: string | null | undefined;
    iconUrl?: string | null | undefined;
    subIcon?: UserSubIcon | null | undefined;
    userName: string | null | undefined;
}