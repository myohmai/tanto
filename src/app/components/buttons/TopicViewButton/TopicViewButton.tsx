import './TopicViewButton.scss';

type Props = {
    onClick: () => void;
}

export const TopicViewButton = ({ onClick }: Props) => {
    return (
        <button className="topic-view-button padding-xs-md" onClick={onClick}>
            View
        </button>
    );
}