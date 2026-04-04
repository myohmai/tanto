import { ReplyIcon } from "@/app/components/icons";
import "./ReplyButton.scss";

type Props = {
    replyCount: number;
    onClick: () => void;
}

export const ReplyButton = ({ replyCount, onClick }: Props) => {
    return (
        <button onClick={onClick} className="reply-button inline-xs">
            <ReplyIcon size="md" className="icon-color-primary" />
            {replyCount > 0 && <span className="reply-button__count text-color-primary">{replyCount}</span>}
        </button>
    );
}