"use client";
import { useState } from 'react';
import { HomeIcon, RoomIcon, MoodIcon, SearchIcon, MessageIcon, AccountIcon, FondLineIcon, BookMarkIcon, SettingIcon } from '@/app/components/icons';
import { LogOutButton } from '@/app/components/buttons/LogOutButton';
import { useTranslations } from 'next-intl';

import './SideNavBar.scss'
import { LogoIcon } from '../../logo/icon';
import { Logotype } from '../../logo/logotype';

type SideBarType = 'Home' | 'Hallway' | 'Mood' | 'Message' | 'Dashboard' | 'Fond' | 'Bookmark' | 'Settings';

type Props = {
    selected: SideBarType;
    onRefresh?: () => void;
    onChange: (value: SideBarType) => void;
    onLogOut: () => void;
}

export const SideNavBar = ({ selected, onRefresh = () => window.location.reload(), onChange, onLogOut }: Props) => {
    const t = useTranslations('nav');
    const tc = useTranslations('common');
    const [toast, setToast] = useState(false);

    const handleSearch = () => {
        setToast(true);
        setTimeout(() => setToast(false), 2000);
    };

    return(
        <div className="sidebar bg-color-primary text-color-primary">
            <div className="sidebar__container stack-md">
                <button type='button' className='sidebar__button inline-md' onClick={onRefresh}>
                    <LogoIcon size='lg'/>
                    <span className='sidebar__label'><Logotype /></span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Home')}>
                    <HomeIcon size='lg' variant={selected === "Home" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('home')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Hallway')}>
                    <RoomIcon size='lg' variant={selected === "Hallway" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('hallway')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Mood')}>
                    <MoodIcon size='lg' variant={selected === "Mood" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('mood')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={handleSearch}>
                    <SearchIcon size='lg'/>
                    <span className='sidebar__label'>{t('search')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Message')}>
                    <MessageIcon size='lg' variant={selected === "Message" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('message')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Dashboard')}>
                    <AccountIcon size='lg' className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('dashboard')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Fond')}>
                    <FondLineIcon size='lg' className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('fond')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Bookmark')}>
                    <BookMarkIcon size='lg' variant={selected === "Bookmark" ? "fill" : "line"} className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('bookmark')}</span>
                </button>
                <button type='button' className='sidebar__button inline-md' onClick={() => onChange('Settings')}>
                    <SettingIcon size='lg' className='icon-color-primary'/>
                    <span className='sidebar__label'>{t('settings')}</span>
                </button>
            </div>
            <div className='sidebar__logout'><LogOutButton onClick={onLogOut} /></div>
            {toast && <div className="toast">{tc('comingSoon')}</div>}
        </div>
    )
}
