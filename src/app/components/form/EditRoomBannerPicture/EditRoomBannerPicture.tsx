import { AddBannerPictureButton } from "@/app/components/buttons/AddBannerPictureButton";

import './EditRoomBannerPicture.scss'
import { useState } from "react";

type Props = {
    bannerImageUrl?: string | null;
    onChangeBanner: (file: File) => void;
}

export const EditRoomBannerPicture = ({ bannerImageUrl, onChangeBanner }: Props ) => {
    const [preview, setPreview] = useState<string | null>(null);
    return (
        <div className="edit-room-banner">
            <img src={preview || bannerImageUrl || "/images/default.png" } alt="Room banner" />
            <AddBannerPictureButton
                onSelectFile={(file) => {
                    setPreview(URL.createObjectURL(file));
                    onChangeBanner?.(file);
                }}
                className="edit-room-banner__button"
            />
        </div>
    )
}