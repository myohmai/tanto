import { TabButton } from '@/app/components/buttons/TabButton';

import './RoomTabBar.scss';

type TabType = 'Gloss' | 'Salon' | 'Turn Table';

type Props = {
    selectedTab: TabType;
    onChange: (value: TabType) => void;
}

export const RoomTabBar = ({ selectedTab, onChange }: Props) => {
    return(
        <div className='room-tab-bar'>
            <TabButton label="Gloss" isSelected={selectedTab === 'Gloss'} onSelect={() => onChange('Gloss')} />
            <TabButton label="Salon" isSelected={selectedTab === 'Salon'} onSelect={() => onChange('Salon')} />
            <TabButton label="Turn Table" isSelected={selectedTab === 'Turn Table'} onSelect={() => onChange('Turn Table')}  />
        </div>
    )
}