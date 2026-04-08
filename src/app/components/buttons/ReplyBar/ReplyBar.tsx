import { UserCustomIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { BiasColor } from "@/app/components/icons";
import './ReplyBar.scss';

type Props = {
    userIconUrl: string;
    userSubIcon?: { type: 'emoji'; value: string } | { type: 'fond'; value: BiasColor };
    onClick: () => void;
};

export const ReplyBar = ({ userIconUrl, userSubIcon, onClick }: Props) => {
    return (
        <button className="reply-bar padding-sm-md inline-md bg-color-primary" onClick={onClick}>
            <div className="reply-bar__icon-wrapper">
                <UserCustomIcon iconUrl={userIconUrl} subIcon={userSubIcon} className="reply-bar__icon" />
            </div>
            <div className="reply-bar__text bg-color-secondary text-color-secondary">Write a reply...</div>
        </button>
    );
}