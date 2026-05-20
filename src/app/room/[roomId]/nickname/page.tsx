import { EnterRoomClient } from "./EnterRoomClient";

export default async function Page({ params }: {
    params: Promise<{ roomId: string }>;
}) {
    const { roomId } = await params;

    return <EnterRoomClient roomId={roomId} />;
}