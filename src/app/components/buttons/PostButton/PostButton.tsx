import './PostButton.scss';

type Props = {
    onClick: () => void;
    disabled?: boolean;
};

export const PostButton = ({ onClick, disabled }: Props) => {
    return (
        <button className="post-button padding-sm-md" onClick={onClick} disabled={disabled}>
        Post
        </button>
    );
    }