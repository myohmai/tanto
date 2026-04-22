import { SearchIcon } from '@/app/components/icons'
import { BackButton  } from '@/app/components/buttons/BackButton'
import { useState } from 'react'

import './SearchBar.scss'

type Props = {
    onBack: () => void;
    onSearch: (value: string) => void;
}

export const SearchBar = ({ onBack, onSearch}: Props ) => {
    const [value, setValue] = useState('')
    return (
        <div className="search-bar bg-color-primary padding-sm-md inline-md">
            <div className='search-bar__back'><BackButton onClick={onBack} /></div>
            <div className="search-bar__container bg-color-secondary padding-sm-md inline-md">
                <input
                    type="search" 
                    placeholder='Search'
                    className='search-bar__input text-color-primary'
                    value={value}
                    onChange={(e)=> setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && value.trim()) onSearch(value)
                    }}
                />
                <button type="button" onClick={() => onSearch(value)} className='search-bar__button'>
                    <SearchIcon size="md" className='icon-color-primary' />
                </button>
            </div>
        </div>
    )
}