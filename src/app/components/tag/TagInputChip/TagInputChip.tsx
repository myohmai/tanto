import './TagInputChip.scss';
import { CrossIcon } from "@/app/components/icons";

interface TagInputChipProps {
    label: string;
    onRemove?: () => void;
}

export const TagInputChip = ({ label, onRemove }: TagInputChipProps) => {
    return (
        <div className="tag-input-chip bg-color-secondary inline-xs">
            <span className="tag-input-chip__label text-color-primary">{label}</span>
            {onRemove && (
                <button className="tag-input-chip__remove-button" onClick={onRemove}>
                    <CrossIcon className='tag-input-chip__remove-icon icon-color-primary' />
                </button>
            )}
        </div>
    );
};