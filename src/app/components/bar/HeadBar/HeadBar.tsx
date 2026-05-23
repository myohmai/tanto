'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { LogoIcon } from '@/app/components/logo/icon';
import { HamburgerIcon, SearchIcon } from '@/app/components/icons';

import './HeadBar.scss'

type Props = {
    onReload?: () => void;
    onSideMenu: () => void;
}

export const HeadBar = ({ onReload = () => window.location.reload(), onSideMenu }: Props) => {
    const t = useTranslations('common');
    const [toast, setToast] = useState(false);

    const handleSearch = () => {
        setToast(true);
        setTimeout(() => setToast(false), 2000);
    };

    return(
        <div className="head-bar padding-md-lg bg-color-primary">
            <button type='button' onClick={onSideMenu} className="head-bar__side-menu" aria-label='Side Menu'>
                <HamburgerIcon size="lg" className='icon-color-secondary' />
            </button>
            <button type='button' onClick={onReload} className="head-bar__reload" aria-label='Reload'>
                <LogoIcon />
            </button>
            <button type='button' onClick={handleSearch} className="head-bar__search" aria-label='Search'>
                <SearchIcon size='lg' className='icon-color-secondary' />
            </button>
            {toast && <div className="toast">{t('comingSoon')}</div>}
        </div>
    )
}
