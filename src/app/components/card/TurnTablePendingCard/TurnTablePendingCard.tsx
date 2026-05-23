import { TurnTableAcceptation } from '@/app/components/buttons/TurnTableAcceptation';
import { LocationIcon, TrashIcon } from '@/app/components/icons';
import type { SongRequestWithVotes } from '@/app/types/songRequest';
import './TurnTablePendingCard.scss';

type Props = {
    request: SongRequestWithVotes;
    hasVoted: boolean;
    onAccept: () => void;
    onReject: () => void;
    onDelete?: () => void;
};

export const TurnTablePendingCard = ({ request, hasVoted, onAccept, onReject, onDelete }: Props) => {
    const { type, metadata, votes, activeMembers } = request;
    const approveCount = votes.filter(v => v.approved).length;
    const totalVotes = votes.length;
    const voteRate = activeMembers > 0 ? Math.round((totalVotes / activeMembers) * 100) : 0;

    const thumbnail = type === 'video' && metadata.videoId
        ? `https://img.youtube.com/vi/${metadata.videoId}/mqdefault.jpg`
        : metadata.thumbnail;

    const subLabel = type === 'video' ? metadata.channelName : metadata.artist;
    const serviceLabel = type === 'video' ? 'YouTube' : metadata.service ?? '';

    return (
        <div className="turn-table-pending-card bg-color-primary padding-lg stack-sm">
            {thumbnail && (
                <img
                    src={thumbnail}
                    className="turn-table-pending-card__thumbnail"
                    alt={metadata.title}
                />
            )}
            <div className="turn-table-pending-card__info text-color-primary stack-xs">
                <div className="turn-table-pending-card__title">{metadata.title}</div>
                {subLabel && (
                    <div className="turn-table-pending-card__sub text-color-secondary">
                        {subLabel}
                    </div>
                )}
            </div>
            <div className="turn-table-pending-card__footer">
                <div className="turn-table-pending-card__service text-color-secondary inline-xs">
                    <LocationIcon className="icon-color-secondary" />
                    <span>{serviceLabel}</span>
                </div>
                <div className="turn-table-pending-card__vote-status text-color-secondary">
                    <span>{approveCount}/{totalVotes} votes · {voteRate}%</span>
                </div>
            </div>
            {(request.status === 'rejected' || request.status === 'timeout') ? (
                <div className="turn-table-pending-card__failed inline-xs">
                    <span className="text-color-secondary">
                        {request.status === 'rejected' ? 'Rejected' : 'Timed out'}
                    </span>
                    {onDelete && (
                        <button type="button" onClick={onDelete} className="icon-color-secondary">
                            <TrashIcon />
                        </button>
                    )}
                </div>
            ) : !hasVoted ? (
                <TurnTableAcceptation onAccept={onAccept} onReject={onReject} />
            ) : (
                <div className="turn-table-pending-card__voted text-color-secondary">Voted</div>
            )}
        </div>
    );
};
