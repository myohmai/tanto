import { CircleIcon, CrossIcon } from "@/app/components/icons";
import './TurnTableAcceptation.scss'

type Props = {
    onAccept: () => void;
    onReject: () => void;
}

export const TurnTableAcceptation = ({ onAccept, onReject }: Props) => {
    return (
        <div className="turn-table-acceptation inline-lg">
            <button type="button" className="turn-table-acceptation__accept padding-sm-lg inline-sm" onClick={onAccept} aria-label="Accept">
                <CircleIcon className="turn-table-acceptation__accept-icon" />
                <span>Accept</span>
            </button>
            <button type="button" className="turn-table-acceptation__reject padding-sm-lg inline-sm" onClick={onReject} aria-label="Cancel">
                <CrossIcon className="turn-table-acceptation__reject-icon" />
                <span>Cancel</span>
            </button>
        </div>
    );
}