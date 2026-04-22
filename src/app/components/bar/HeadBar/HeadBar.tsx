import { LogoIcon } from '@/app/components/logo/icon';
import { HamburgerIcon, SearchIcon } from '@/app/components/icons';

import './HeadBar.scss'

type Props = {
    onReload: () => void;
    onSideMenu: () => void;
    onSearch: () => void;
}

export const HeadBar = ({ onReload, onSideMenu, onSearch }: Props) => {
    return(
        <div className="head-bar padding-md-lg bg-color-primary">
            <button type='button' onClick={onSideMenu} className="head-bar__side-menu" aria-label='Side Menu'>
                <HamburgerIcon size="lg" className='icon-color-secondary' />
            </button>
            <button type='button' onClick={onReload} className="head-bar__reload" aria-label='Reload'>
                <LogoIcon />
            </button>
            <button type='button' onClick={onSearch} className="head-bar__search" aria-label='Search'>
                <SearchIcon size='lg' className='icon-color-secondary' />
            </button>
        </div>
    )
}