"use client";
import { TabButton } from '@/app/components/buttons/TabButton';
import { useTranslations } from 'next-intl';

import './DashBoardTabBar.scss';

export type DashBoardTabType = 'My Gloss' | 'Joined Room' | 'Owned Room';

type Props = {
    selectedTab: DashBoardTabType;
    onChange: (value: DashBoardTabType) => void;
}

export const DashBoardTabBar = ({ selectedTab, onChange }: Props) => {
    const t = useTranslations('dashboard');
    return(
        <div className='dash-board-tab-bar'>
            <TabButton label={t('myGloss')} isSelected={selectedTab === 'My Gloss'} onSelect={() => onChange('My Gloss')} />
            <TabButton label={t('joinedRoom')} isSelected={selectedTab === 'Joined Room'} onSelect={() => onChange('Joined Room')} />
            <TabButton label={t('ownedRoom')} isSelected={selectedTab === 'Owned Room'} onSelect={() => onChange('Owned Room')}  />
        </div>
    )
}