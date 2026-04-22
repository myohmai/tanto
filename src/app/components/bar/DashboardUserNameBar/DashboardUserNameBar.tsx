import { UserCustomIcon, UserSubIcon } from '@/app/components/custom-icon/UserCustomIcon'
import { PulldownArrow } from "@/app/components/buttons/PulldownArrow";
import React, { useState } from 'react';

import './DashboardUserNameBar.scss'

type UserNameList = {
    roomId: string;
    roomName: string;
    iconUrl?: string;
    subIcon?: UserSubIcon;
    userName: string;
}

type CurrentRoom = {
    roomId: string;
    roomName: string;
    iconUrl?: string;
    subIcon?: UserSubIcon;
    userName: string;
}

type Props = {
    list: UserNameList[];
    currentRoom: CurrentRoom;
    onChange: (roomId: string) => void;
}

export const DashboardUserNameBar = ({ list, currentRoom, onChange }: Props) => {
    const fliteredList = list.filter(item => item.roomId !== currentRoom.roomId);
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="dash-board-user-name-bar bg-color-primary">
            <div className="dash-board-user-name-bar__current padding-md inline-lg" onClick={() => onChange(currentRoom.roomId)}>
                <UserCustomIcon iconUrl={currentRoom.iconUrl} subIcon={currentRoom.subIcon} className='dash-board-user-name-bar__current--icon' />
                <div className="dash-board-user-name-bar__current--name text-color-primary">{currentRoom.userName}</div>
                <div className="dash-board-user-name-bar__current--room text-color-secondary">{currentRoom.roomName}</div>
                <PulldownArrow onToggle={() => {
                        setIsOpen((prev) => !prev);
                    }} isOpen={isOpen} />
            </div>
            <ul className={`dash-board-user-name-bar__list ${isOpen ? 'open' : ''}`}>
                {fliteredList.map(item => (
                    <li key={item.roomId} className="dash-board-user-name-bar__list-item">
                        <button type='button' onClick={() => onChange(item.roomId)} className="dash-board-user-name-bar__button padding-md inline-lg">
                            <UserCustomIcon iconUrl={item.iconUrl} subIcon={item.subIcon} className='dash-board-user-name-bar__button--icon'/>
                            <div className="dash-board-user-name-bar__button--name text-color-primary">{item.userName}</div>
                            <div className="dash-board-user-name-bar__button--room text-color-secondary">{item.roomName}</div>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}