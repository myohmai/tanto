import { HomeIcon, RoomIcon, MoodIcon, SearchIcon, MessageIcon, AccountIcon, FondLineIcon, BookMarkIcon, SettingIcon } from '@/app/components/icons'
import { LogOutButton } from '@/app/components/buttons/LogOutButton'

import './SideNavBar.scss'

type SideBarType = 'Home' | 'Room' | 'Mood' | 'Search' | 'Message' | 'Dashboard' | 'Fond' | 'Bookmark' | 'Settings';

type Props = {
    selected: SideBarType;
    onChange: (value: SideBarType) => void;
    onLogOut: () => void;
}

export const SideNavBar = ({ selected, onChange, onLogOut }: Props) => {
    return(
        <div className="sidebar bg-color-primary text-color-primary">
            <div className="sidebar__container stack-md">
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Home')}>
                    <HomeIcon size='lg' variant={selected === "Home" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>Home</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Room')}>
                    <RoomIcon size='lg' variant={selected === "Room" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>Room</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Mood')}>
                    <MoodIcon size='lg' variant={selected === "Mood" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>Mood</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Search')}>
                    <SearchIcon size='lg'/>
                    <span className='sidebar__label'>Search</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Message')}>
                    <MessageIcon size='lg' variant={selected === "Message" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>Message</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Dashboard')}>
                    <AccountIcon size='lg' className='icon-color-primary'/>
                    <span className='sidebar__label'>Dashboard</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Fond')}>
                    <FondLineIcon size='lg' className='icon-color-primary'/>
                    <span className='sidebar__label'>Fond</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Bookmark')}>
                    <BookMarkIcon size='lg' variant={selected === "Bookmark" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>Bookmark</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Settings')}>
                    <SettingIcon size='lg' className='icon-color-primary'/>
                    <span className='sidebar__label'>Settings</span>
                </button>
            </div>
            <div className='sidebar__logout'><LogOutButton onClick={onLogOut} /></div>
        </div>
    )
}