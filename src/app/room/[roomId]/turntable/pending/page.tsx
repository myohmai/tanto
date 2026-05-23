"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { TurnTablePendingList } from "@/app/components/list/TurnTablePendingList";
import { getCurrentUserId } from "@/repositories/currentUser";
import {
    getPendingSongRequests,
    getSongRequestWithVotes,
    submitVote,
    getMyFailedSongRequests,
    deleteSongRequest,
} from "@/repositories/songRequest";

import type { SongRequest, SongRequestWithVotes } from "@/app/types/songRequest";

export default function Page({ params }: { params: Promise<{ roomId: string }> }) {
    const { roomId } = use(params);
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [requests, setRequests] = useState<SongRequestWithVotes[]>([]);
    const [failedRequests, setFailedRequests] = useState<SongRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUserId().then(setUserId);
    }, []);

    useEffect(() => {
        load();
    }, [roomId]);

    useEffect(() => {
        if (!userId) return;
        getMyFailedSongRequests(roomId, userId).then(setFailedRequests);
    }, [roomId, userId]);

    const load = async () => {
        setIsLoading(true);
        const pending = await getPendingSongRequests(roomId);
        const withVotes = await Promise.all(
            pending.map(r => getSongRequestWithVotes(r.id))
        );
        setRequests(withVotes.filter((r): r is SongRequestWithVotes => r !== null));
        setIsLoading(false);
    };

    const handleVote = async (requestId: string, approved: boolean) => {
        if (!userId) return;
        await submitVote(requestId, userId, approved);
        await load();
    };

    const handleDeleteFailed = async (requestId: string) => {
        await deleteSongRequest(requestId);
        setFailedRequests(prev => prev.filter(r => r.id !== requestId));
    };

    const failedWithVotes: SongRequestWithVotes[] = failedRequests.map(r => ({
        ...r,
        votes: [],
        activeMembers: 0,
    }));

    return (
        <div className="pending-page">
            <div className="pending-page__header padding-sm-md inline-sm">
                <button type="button" onClick={() => router.back()}>← Back</button>
                <span>Certification</span>
            </div>
            <TurnTablePendingList
                requests={requests}
                currentUserId={userId ?? ""}
                onAccept={(id) => handleVote(id, true)}
                onReject={(id) => handleVote(id, false)}
                isLoading={isLoading}
            />
            {failedWithVotes.length > 0 && (
                <div className="pending-page__failed">
                    <div className="pending-page__failed-title padding-sm-md text-color-secondary">
                        Failed requests
                    </div>
                    <TurnTablePendingList
                        requests={failedWithVotes}
                        currentUserId={userId ?? ""}
                        onAccept={() => {}}
                        onReject={() => {}}
                        onDelete={handleDeleteFailed}
                    />
                </div>
            )}
        </div>
    );
}
