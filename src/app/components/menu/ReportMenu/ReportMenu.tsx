'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { ExclamationIcon } from "@/app/components/icons";

import './ReportMenu.scss'

type Props = {
    onOffensive: () => void;
    onUnverified: () => void;
    onInappropriate: () => void;
    onIdentifiable: () => void;
    onAdult: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export const ReportMenu = ({ onOffensive, onUnverified, onInappropriate, onIdentifiable, onAdult, isOpen, onClose }: Props ) => {
    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="report-menu stack-md">
            <div className="report-menu__title padding-md-lg inline-md text-color-primary">
                <ExclamationIcon className="icon-color-primary"/>
                <span>Report this Gloss</span>
            </div>
            <div className="report-menu__container stack-sm">
                <BottomMenuButton label="Offensive content" onClick={onOffensive} />
                <BottomMenuButton label="Unverified information" onClick={onUnverified} />
                <BottomMenuButton label="Inappropriate content" onClick={onInappropriate} />
                <BottomMenuButton label="Personally identifiable information" onClick={onIdentifiable} />
                <BottomMenuButton label="Adult content" onClick={onAdult} />
            </div>
        </BottomSheet>
    )
}