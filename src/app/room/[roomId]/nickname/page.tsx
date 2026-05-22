import { EnterRoomClient } from "./EnterRoomClient";

export default async function Page({ params, searchParams }: {
    params: Promise<{ roomId: string }>;
    searchParams: Promise<{ returnTo?: string }>;
}) {
    const { roomId } = await params;
    const { returnTo } = await searchParams;

    return <EnterRoomClient roomId={roomId} returnTo={returnTo} />;
}