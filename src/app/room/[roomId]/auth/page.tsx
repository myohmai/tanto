"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EnterPrivateRoomKeyword } from "@/app/components/room/EnterPrivateRoom";
import { EnterPrivateRoomQuiz } from "@/app/components/room/EnterPrivateRoom";
import { EnterTheRoom } from "@/app/components/room/EnterTheRoom";
import { getCurrentUserId } from "@/repositories/currentUser";
import {
    getPrivateRoomGate,
    verifyPrivateRoomEntry,
    enterPrivateRoom,
    type PrivateRoomGate,
    type PrivateRoomCredentials,
} from "@/repositories/privateRoom";

// Private Room の入室画面
//   1. 合言葉 / クイズを入力 → DB 関数で判定(verify_private_room_entry)
//   2. 通ったら Room 内プロフィール(ニックネーム等)を入力
//   3. 同じ合言葉 / 回答で enter_private_room を呼び、DB 側で再判定して参加登録
export default function Page({
    params,
}: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = use(params);
    const router = useRouter();
    const [gate, setGate] = useState<PrivateRoomGate | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [credentials, setCredentials] = useState<PrivateRoomCredentials | null>(null);

    useEffect(() => {
        (async () => {
            const [uid, gateData] = await Promise.all([
                getCurrentUserId(),
                getPrivateRoomGate(roomId),
            ]);
            // Private Room でない / すでにメンバーなら Room へ
            if (!gateData || gateData.isMember) {
                router.replace(`/room/${roomId}`);
                return;
            }
            setUserId(uid);
            setGate(gateData);
        })().catch((e) => console.error('Failed to load private room gate:', e));
    }, [roomId, router]);

    const verify = async (next: PrivateRoomCredentials) => {
        const ok = await verifyPrivateRoomEntry(roomId, next);
        if (ok) setCredentials(next);
        return ok;
    };

    if (!gate || !userId) return null;

    if (credentials) {
        return (
            <EnterTheRoom
                userId={userId}
                roomId={gate.roomId}
                roomName={gate.roomName}
                roomIconUrl={gate.roomIconUrl}
                bannerUrl={gate.roomBannerUrl}
                roomRule={gate.roomRule}
                roomMemberIni={gate.roomMemberIni ?? { iconUrl: null, initialName: null }}
                onEnter={async (payload) => {
                    const ok = await enterPrivateRoom(roomId, credentials, {
                        userName: payload.userName,
                        iconUrl: payload.iconUrl,
                        subIcon: payload.subIcon,
                    });
                    if (ok) router.push(`/room/${roomId}`);
                    else setCredentials(null);
                }}
            />
        );
    }

    if (gate.entrySetting === "keyword") {
        return (
            <EnterPrivateRoomKeyword
                roomName={gate.roomName}
                roomIconUrl={gate.roomIconUrl}
                bannerUrl={gate.roomBannerUrl}
                roomKeyWordHint={gate.keywordHint ?? undefined}
                onSubmit={(keyword) => verify({ keyword })}
            />
        );
    }

    if (gate.entrySetting === "quiz") {
        return (
            <EnterPrivateRoomQuiz
                roomName={gate.roomName}
                roomIconUrl={gate.roomIconUrl}
                bannerUrl={gate.roomBannerUrl}
                roomQuiz={gate.quiz}
                onSubmit={(answers) => verify({ answers })}
            />
        );
    }

    return null;
}
