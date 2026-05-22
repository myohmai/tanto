import { RoomCustomIcon } from "@/app/components/custom-icon/RoomCustomIcon";
import { EditSalonIconButton } from "@/app/components/buttons/EditSalonIconButton";
import { ChooseSalonIcon } from "@/app/components/menu/ChooseSubIcon";
import { FondIcon, CheckBoxIcon } from "@/app/components/icons";
import { DeleteButton } from "@/app/components/buttons/DeleteButton";
import { SalonData } from "@/app/types/salon";

import { useState } from "react";

import './SalonSettings.scss'
import { SubmitButton } from "../../buttons/SubmitButton";



type Props = {
    salonData: SalonData;
    roomIconUrl?: string | undefined | null;
    roomName: string;
    isHost: boolean;
    onChangeSalonData: (payload: SalonData) => void;
    onSubmit: (payload: SalonData) => void;
    onCancel: () => void;
    onDelete: () => void;
}

export const SalonSettings = ({
    salonData,
    roomIconUrl,
    roomName,
    isHost,
    onChangeSalonData,
    onSubmit,
    onCancel,
    onDelete
}: Props) => {
    const [isIconOpen, setIsIconOpen] = useState(false);
    const handleSubmit = () => {
        onSubmit(salonData);
    }
    const isSalonNameEmpty = salonData.salonName.trim() === "";
    return(
        <div className="salon-settings bg-color-primary text-color-primary">
            <div className="salon-settings__title padding-sm-lg">
                <button type="button" onClick={onCancel} className="salon-settings__cancel">Cancel</button>
                <span>Edit Salon</span>
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
                        onChangeSalonData({
                            ...salonData,
                            salonIcon: icon,
                        })
                    }}
                    isOpen={isIconOpen}
                    onClose={() => setIsIconOpen(false)}
                />
                <EditSalonIconButton onClick={() => {setIsIconOpen(true)}}/>
            </div>
            <div className="input-box">
                <div className="input-box__container">
                    <div className="input-box__label">Salon Name</div>
                    <input
                        className="input-box__text-box"
                        placeholder="Salon Name"
                        value={salonData.salonName}
                        maxLength={30}
                        onChange={(e) => {
                            onChangeSalonData({
                                ...salonData,
                                salonName: e.target.value,
                            })
                        }}
                    />
                </div>
            </div>
            {isHost && (
                <div className="salon-settings__topic">
                    <button
                        type="button"
                        onClick={() => {
                            onChangeSalonData({
                                ...salonData,
                                isTopicBox: !salonData.isTopicBox,
                            })
                        }}
                    >
                        <CheckBoxIcon variant={salonData.isTopicBox ? "active" : "inactive"} className="salon-settings__check-icon"/>
                    </button>
                    Set up a TopicBox
                </div>
            )}
                <SubmitButton
                    label="Confirm"
                    disabled={isSalonNameEmpty} 
                    onClick={handleSubmit}
                />
                <DeleteButton label="Delete This Salon" onClick={onDelete} />
        </div>
    )
}