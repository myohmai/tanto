"use client";
import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { EditSalonIconButton } from "@/app/components/buttons/EditSalonIconButton";
import { ChooseSalonIcon } from "@/app/components/menu/ChooseSubIcon";
import { FondIcon, CheckBoxIcon } from "@/app/components/icons";
import { SalonData } from "@/app/types/salon";
import { useTranslations } from "next-intl";

import { nanoid } from "nanoid";

import { useState } from "react";

import './SalonSettings.scss'
import { SubmitButton } from "../../buttons/SubmitButton";

type Props = {
    roomId: string;
    roomIconUrl?: string;
    roomName: string;
    isHost: boolean;
    onSubmit: (payload: SalonData) => void;
    onCancel: () => void;
}

export const CreateSalon = ({
    roomId,
    roomIconUrl,
    roomName,
    isHost,
    onSubmit,
    onCancel
}: Props) => {
    const t = useTranslations("salon");
    const tCommon = useTranslations("common");
    const [salonId] = useState(() => nanoid());
    const [salonData, setSalonData] = useState<SalonData>({
        salonId,
        roomId: roomId,
        salonName: "",
        salonIcon: {type: "fond", value: "red"},
        isTopicBox: false,
        isPinned: false,
    })
    const [isIconOpen, setIsIconOpen] = useState(false);
    const handleSubmit = () => {
        onSubmit(salonData);
    }
    const isSalonNameEmpty = salonData.salonName.trim() === "";
    return(
        <div className="salon-settings bg-color-primary text-color-primary">
            <div className="salon-settings__title padding-sm-lg">
                <button type="button" onClick={onCancel} className="salon-settings__cancel">{tCommon("cancel")}</button>
                <span>{t("new")}</span>
            </div>

            <div className="salon-settings__room-name">
                <RoomCustomIcon roomIconUrl={roomIconUrl} />
                <span>{roomName}</span>
            </div>
            <div className="salon-settings__salon-icon">
                {salonData.salonIcon.type === 'emoji' && (<span className="salon-card__emoji">{salonData.salonIcon.value}</span>)}
                {salonData.salonIcon.type === 'fond' && (<FondIcon size="lg" bias={salonData.salonIcon.value} className="salon-card__fond" />)}
                <ChooseSalonIcon
                    onSubmit={(icon) => {
                        setSalonData((prev) => ({
                            ...prev,
                            salonIcon: icon,
                        }))
                    }}
                    isOpen={isIconOpen}
                    onClose={() => setIsIconOpen(false)}
                />
                <EditSalonIconButton onClick={() => {setIsIconOpen(true)}}/>
            </div>
            <div className="input-box">
                <div className="input-box__container">
                    <div className="input-box__label">{t("name")}</div>
                    <input
                        className="input-box__text-box"
                        placeholder={t("namePlaceholder")}
                        value={salonData.salonName}
                        maxLength={30}
                        onChange={(e) => {
                            setSalonData((prev) => ({
                                ...prev,
                                salonName: e.target.value,
                            }))
                        }}
                    />
                </div>
            </div>
            {isHost && (
                <div className="salon-settings__topic">
                    <button
                        type="button"
                        onClick={() => {
                            setSalonData((prev) => ({
                                ...prev,
                                isTopicBox: !prev.isTopicBox,
                            }))
                        }}
                    >
                        <CheckBoxIcon variant={salonData.isTopicBox ? "active" : "inactive"} className="salon-settings__check-icon"/>
                    </button>
                    {t("topicBox")}
                </div>
            )}
                <SubmitButton
                    label={t("create")}
                    disabled={isSalonNameEmpty}
                    onClick={handleSubmit}
                />
        </div>
    )
}
