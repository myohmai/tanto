import { TabButton } from '@/app/components/buttons/TabButton';

import './DashBoardTabBar.scss';

type DashBoardTabType = 'My Gloss' | 'Joined Room' | 'Owned Room';

type Props = {
    selectedTab: DashBoardTabType;
    onChange: (value: DashBoardTabType) => void;
}

export const DashBoardTabBar = ({ selectedTab, onChange }: Props) => {
    return(
        <div className='dash-board-tab-bar'>
            <TabButton label="My Gloss" isSelected={selectedTab === 'My Gloss'} onSelect={() => onChange('My Gloss')} />
            <TabButton label="Joined Room" isSelected={selectedTab === 'Joined Room'} onSelect={() => onChange('Joined Room')} />
            <TabButton label="Owned Room" isSelected={selectedTab === 'Owned Room'} onSelect={() => onChange('Owned Room')}  />
        </div>
    )
}