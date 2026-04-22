import { TabButton } from '@/app/components/buttons/TabButton';

import './SearchTabBar.scss'

type SearchTabType = 'Gloss' | 'Salon' | 'Media';

type Props = {
    selectedTab: SearchTabType;
    onChange: (value: SearchTabType) => void;
}

export const SearchTabBar = ({ selectedTab, onChange }: Props) => {
    return(
        <div className='search-tab-bar'>
            <TabButton label="Gloss" isSelected={selectedTab === 'Gloss'} onSelect={() => onChange('Gloss')} />
            <TabButton label="Salon" isSelected={selectedTab === 'Salon'} onSelect={() => onChange('Salon')} />
            <TabButton label="Media" isSelected={selectedTab === 'Media'} onSelect={() => onChange('Media')}  />
        </div>
    )
}