import { AddPictureIcon } from "@/app/components/icons";
import './AddBannerPictureButton.scss'
import { useRef } from "react";

type Props = {
    onSelectFile: (file: File) => void;
    className?: string;
}

export const AddBannerPictureButton = ({ onSelectFile, className }: Props) => {
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
            accept="image/*"
            ref={inputRef}
            onChange={handleFileChange}
            hidden
            />

            <button type="button" onClick={() => inputRef.current?.click()} className={`add-banner-picture-button padding-xs-sm inline-xs ${className || ""} `} aria-label="Select banner image">
                <AddPictureIcon size="md" className="add-banner-picture-button__icon" />
            </button>
        </>
    );
}