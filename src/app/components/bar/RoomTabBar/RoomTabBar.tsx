"use client";
import { TabButton } from '@/app/components/buttons/TabButton';
import { useTranslations } from 'next-intl';

import './RoomTabBar.scss';

export type TabType = 'Gloss' | 'Salon' | 'Turn Table';

type Props = {
    selectedTab: TabType;
    onChange: (value: TabType) => void;
}

export const RoomTabBar = ({ selectedTab, onChange }: Props) => {
    const t = useTranslations('room');
    return(
        <div className='room-tab-bar'>
            <TabButton label={t('tabs.gloss')} isSelected={selectedTab === 'Gloss'} onSelect={() => onChange('Gloss')} />
            <TabButton label={t('tabs.salon')} isSelected={selectedTab === 'Salon'} onSelect={() => onChange('Salon')} />
            <TabButton label={t('tabs.turnTable')} isSelected={selectedTab === 'Turn Table'} onSelect={() => onChange('Turn Table')}  />
        </div>
    )
}