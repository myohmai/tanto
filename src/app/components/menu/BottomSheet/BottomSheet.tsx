import { Children, ReactNode } from 'react'
import './BottomSheet.scss'

type Props = {
    children: ReactNode;
    contentClassName?: string;
}

export const BottomSheet = ( {children, contentClassName}: Props) => {
    return (
        <div className="bottom-sheet bg-color-primary">
            <div className="bottom-sheet__bar"></div>
            <div className={`bottom-sheet__content ${contentClassName ?? ''}`}>{children}</div>
        </div>
    )
}