import { ReactNode } from 'react'
import './BottomMenuButton.scss'

type BottomMenuProps = {
    icon?: ReactNode;
    label: string;
    onClick: () => void;
}

export const BottomMenuButton = ({ icon, label, onClick }: BottomMenuProps ) => {
    return (
        <button type="button" className='bottom-menu-button padding-md-lg bg-color-secondary' onClick={onClick} >
        {icon && (
            <span className="bottom-menu-button__icon">
                {icon}
            </span>
        )}
        <span className="bottom-menu-button__label text-color-primary">{label}</span>
    </button>
    )
}