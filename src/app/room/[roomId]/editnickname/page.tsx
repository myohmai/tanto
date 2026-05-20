"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";

import type { User } from "@/app/components/room/EnterTheRoom";

import { EditUserName } from "@/app/components/room/EnterTheRoom";
import { getUserRoomByRoomId, updateUserRoom } from "@/repositories/userRoom";
import { getCurrentUserId } from "@/repositories/currentUser";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const router = useRouter();
    const { roomId } = use(params);

    const [user, setUser] = useState<User>({
    userName: "",
    iconUrl: "",
    subIcon: null,
});

    useEffect(() => {
        (async () => {
            const userId = await getCurrentUserId();
            const data = await getUserRoomByRoomId(roomId, userId);

                if (!data) return;

                setUser({
                    userName: data.userName ?? "",
                    iconUrl: data.iconUrl ?? "",
                    subIcon: data.subIcon ?? null,
                });
        })();
    }, [roomId]);

    const handleSubmit = async (updatedUser: User) => {
        const userId = await getCurrentUserId();

        await updateUserRoom({
            userId,
            roomId: roomId,
            ...updatedUser,
        });

        router.push(`/room/${roomId}`);
    };

    return (
        <EditUserName
            user={user}
            roomName=""
            roomRule=""
            roomMemberIni={{}}
            onChangeUserData={setUser}
            onEnter={handleSubmit}
        />
    );
}