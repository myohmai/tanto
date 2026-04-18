import { PictureIcon } from "@/app/components/icons"
import './PictureButton.scss';
import { useRef } from "react";

type Props = {
    onSelectFile: (file: File[]) => void;
}

// TODO: support multiple file selection (max 4 files)

export const PictureButton = ({ onSelectFile }: Props) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onSelectFile([file]);
        }
    };

    const inputRef = useRef<HTMLInputElement>(null);
    return (
        <>
            <input
            type="file"
            accept="image/png, image/jpeg"
            multiple
            ref={inputRef}
            onChange={handleFileChange}
            hidden
            />

            <button type="button" onClick={() => inputRef.current?.click()} className="picture-button">
            <PictureIcon size="lg" className="icon-color-secondary" />
            </button>
        </>
    );
}