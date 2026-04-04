import './TagChip.scss';

type Props = {
    label: string;
}

export const TagChip = ({ label }: Props) => {
    return (
        <div className='tag-chip padding-xxs-sm'>
            {label}
        </div>
    );
}