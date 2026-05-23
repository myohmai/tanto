import { TurnTablePendingCard } from '@/app/components/card/TurnTablePendingCard';
import type { SongRequestWithVotes } from '@/app/types/songRequest';
import './TurnTablePendingList.scss';

type Props = {
    requests: SongRequestWithVotes[];
    currentUserId: string;
    onAccept: (requestId: string) => void;
    onReject: (requestId: string) => void;
    onDelete?: (requestId: string) => void;
    isLoading?: boolean;
};

export const TurnTablePendingList = ({
    requests,
    currentUserId,
    onAccept,
    onReject,
    onDelete,
    isLoading,
}: Props) => {
    if (isLoading) {
        return <div className="turn-table-pending-list__loading">Loading...</div>;
    }

    if (requests.length === 0) {
        return <div className="turn-table-pending-list__empty">No pending requests</div>;
    }

    return (
        <div className="turn-table-pending-list">
            {requests.map((req) => (
                <TurnTablePendingCard
                    key={req.id}
                    request={req}
                    hasVoted={req.votes.some(v => v.userId === currentUserId)}
                    onAccept={() => onAccept(req.id)}
                    onReject={() => onReject(req.id)}
                    onDelete={onDelete ? () => onDelete(req.id) : undefined}
                />
            ))}
        </div>
    );
};
