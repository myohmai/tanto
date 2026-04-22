import { HomeIcon, RoomIcon, MoodIcon, MessageIcon } from "@/app/components/icons";

import { UserCustomIcon, UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";

import './BottomNavBar.scss';

type BottomNavType = 'Home' | 'Room' | 'Mood' | 'Message' | 'Dashboard';
type CurenntRoom ={
    roomId: string;
    iconUrl?: string;
    subIcon?: UserSubIcon;
}

type Props = {
    bottomSelectTab: BottomNavType;
    onChange: (value: BottomNavType) => void;
    currentRoom?: CurenntRoom;
}

export const BottomNavBar = ({ bottomSelectTab, onChange, currentRoom }: Props) => {
    return (
        <div className="bottom-nav-bar bg-color-primary">
            <button type="button" onClick={() => onChange('Home')} aria-label="Home">
                <HomeIcon size='lg' variant={bottomSelectTab === "Home" ? 'fill' : 'line'} className="icon-color-primary" />
            </button>
            <button type="button" onClick={() => onChange('Room')} aria-label="Room">
                <RoomIcon size='lg' variant={bottomSelectTab === "Room" ? 'fill' : 'line'} className="icon-color-primary" />
            </button>
            <button type="button" onClick={() => onChange('Mood')} aria-label="Mood">
                <MoodIcon size='lg' variant={bottomSelectTab === "Mood" ? 'fill' : 'line'} className="icon-color-primary" />
            </button>
            <button type="button" onClick={() => onChange('Message')} aria-label="Message">
                <MessageIcon size='lg' variant={bottomSelectTab === "Message" ? 'fill' : 'line'} className="icon-color-primary" />
            </button>
            <button type="button" className="bottom-nav-bar__user-icon-button" onClick={() => onChange('Dashboard')} aria-label="Dashboard">
                <UserCustomIcon className="bottom-nav-bar__user-icon" iconUrl={currentRoom?.iconUrl} subIcon={currentRoom?.subIcon}/>
            </button>
        </div>
    )
}