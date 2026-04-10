import { AddPictureIcon } from "@/app/components/icons";
import './EditIconButton.scss';
import { useRef } from "react";

type Props = {
    onSelectFile: (file: File) => void;
}

export const EditIconButton = ({ onSelectFile }: Props) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onSelectFile(file);
        }
        event.target.value = "";
    };

    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <input
            type="file"
            accept="image/png, image/jpeg"
            ref={inputRef}
            onChange={handleFileChange}
            hidden
            />

            <button type="button" onClick={() => inputRef.current?.click()} className="edit-icon-button padding-xs-sm inline-xs" aria-label="Select Image">
                <AddPictureIcon size="sm" className="edit-icon-button__icon" />
                <span className="edit-icon-button__label">Edit Sub Icon</span>
            </button>
        </>
    );
}