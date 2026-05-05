import { UserCustomIcon, UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon"
import { EditIconButton } from "@/app/components/buttons/EditIconButton"
import { EditSubIconButton } from "@/app/components/buttons/EditSubIconButton"
import { ChooseSubIcon } from "@/app/components/menu/ChooseSubIcon"

import { useState } from "react"

import './EditUserProfile.scss'

type Props = {
    UserIconUrl?: string;
    subIcon?: UserSubIcon;
    roomInitialName?: string;
    userName?: string;
    onChangeUserIcon?: (file: File) => void;
    onSubIcon?: (icon: UserSubIcon) => void;
    onChangeName?: (value: string) => void;
} 

export const EditUserProfile = ({ 
    UserIconUrl,
    subIcon,
    roomInitialName,
    userName,
    onChangeUserIcon,
    onSubIcon,
    onChangeName
}: Props ) => {
    const [preview, setPreview] = useState<string | null >(null);
    const [isOpen, setIsOpen] = useState(false);
    const [subIconPreview, setSubIconPreview] = useState<UserSubIcon | null>(null)
    const [nameError, setNameError] = useState<string | null>(null);

    return (
        <div className="edit-user-profile stack-lg">
            <div className="edit-user-profile__icons-wrapper inline-lg">
                <UserCustomIcon iconUrl={ preview || UserIconUrl } subIcon={subIconPreview ?? subIcon} />
                <EditIconButton
                    onSelectFile={(file => {
                        setPreview(URL.createObjectURL(file));
                        onChangeUserIcon?.(file);
                    })}
                />
                <EditSubIconButton
                    onClick={() => {setIsOpen(true)}}
                />
            </div>
            <div className="edit-user-profile__name stack-sm">
                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">Your Name In This Room</div>
                        <input
                            type="text"
                            className="input-box__text-box"
                            maxLength={30}
                            placeholder={userName || roomInitialName || "Your Name"}
                            onChange={(e) => {
                                const value = e.target.value;

                                if (value.length === 0) {
                                    setNameError("Name is required");
                                } else if (value.length > 30) {
                                    setNameError("Max 30 characters");
                                } else {
                                    setNameError(null);
                                }

                                onChangeName?.(value);
                            }}
                        />
                        { nameError && <div className="input-box__error">{nameError}</div> }
                    </div>
                    <div className="edit-user-profile__name-info text-color-secondary ">Your identity can vary across Rooms.</div>
                </div>
            </div>
            <ChooseSubIcon
                onSubmit={(e) => {
                    setSubIconPreview(e);
                    onSubIcon?.(e);
                    setIsOpen(false);
                }}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </div>
    )
}