import { CameraIcon } from "@/app/components/icons"
import './CameraButton.scss';
import { useRef } from "react";

type Props = {
    onSelectFile: (file: File[]) => void;
}

// TODO: support multiple file selection (max 4 files)

export const CameraButton = ({ onSelectFile }: Props) => {
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
            accept="image/*"
            capture="environment"
            ref={inputRef}
            onChange={handleFileChange}
            hidden
            />

            <button  type="button" onClick={() => inputRef.current?.click()} className="camera-button">
            <CameraIcon size="lg" className="icon-color-secondary" />
            </button>
        </>
    );
}