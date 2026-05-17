import { ReplyIcon } from "@/app/components/icons";
import "./ReplyButton.scss";

type Props = {
    replyCount: number;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ReplyButton = ({ replyCount, onClick }: Props) => {
     // round count
        const formatCount = (count: number, locale = "ja") => {
            if (locale === "ja") {
                if (count >= 100000000) return `${(count / 100000000).toFixed(1)}億`;
                if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
                return count.toLocaleString("ja-JP");
            }
    
            if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
            if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
            if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
            return count.toLocaleString("en-US");
        };
        const trim = (num: number) => num.toFixed(1).replace(".0", "");
    return (
        <button type="button" onClick={onClick} className="reply-button inline-xs">
            <ReplyIcon size="md" className="icon-color-primary" />
            {replyCount > 0 && <span className="reply-button__count text-color-primary">{formatCount(replyCount)}</span>}
        </button>
    );
}