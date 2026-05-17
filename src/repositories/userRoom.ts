import type { UserRoomData } from "@/app/types";
import { mockUserRoomData } from "@/mocks/userRoom";

export const getUserRoomData = async (): Promise<UserRoomData[]> => {
    return mockUserRoomData;
};
