import { AddPictureIcon } from "@/app/components/icons";
import './AddBannerPictureButton.scss'
import { useRef } from "react";

type Props = {
    onSelectFile: (file: File) => void;
}

export const AddBannerPictureButton = ({ onSelectFile }: Props) => {
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

            <button type="button" onClick={() => inputRef.current?.click()} className="add-banner-picture-button padding-xs-sm inline-xs" aria-label="Select banner image">
                <div className="add-banner-picture-button__bg"></div>
                <AddPictureIcon size="md" className="add-banner-picture-button__icon" />
            </button>
        </>
    );
}