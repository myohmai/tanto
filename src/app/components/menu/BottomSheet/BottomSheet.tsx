'use client';
import { ReactNode } from 'react'
import './BottomSheet.scss'

import { useRef } from 'react'

type Props = {
    children?: ReactNode;
    isOpen: boolean;
    onClose: () => void;
    contentClassName?: string;
}

export const BottomSheet = ( {children, isOpen, onClose, contentClassName}: Props) => {
    const startY = useRef<number | null>(null);
    const handlePointerDown = (e: React.PointerEvent) => {
        startY.current = e.clientY;
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (startY.current === null) return;
        const diff = e.clientY - startY.current;
        if  (diff > 8 && e.buttons === 1) { // しきい値
            onClose();
            startY.current = null
        }
    }
    const handlePointerUp = () => {
        startY.current = null;

    };
    return (
        <>
            {isOpen && (
                <div className="bottom-sheet__backdrop" onClick={onClose} />
            )}
            <div className={`bottom-sheet bg-color-primary ${isOpen ? 'is-open' : ''}`} onClick={(e) => e.stopPropagation()}>
                <div
                    className="bottom-sheet__bar"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                ></div>
                <div className={`bottom-sheet__content ${contentClassName ?? ''}`}>{children}</div>
            </div>
        </>
    )
}