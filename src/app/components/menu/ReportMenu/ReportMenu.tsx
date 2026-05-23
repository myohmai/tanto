'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { ExclamationIcon } from "@/app/components/icons";
import { useTranslations } from 'next-intl';

import { ReportType } from "@/app/types/report";

import './ReportMenu.scss'

type Props = {
    onSelect: (reason: ReportType) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const ReportMenu = ({ onSelect, isOpen, onClose }: Props ) => {
    const t = useTranslations('reportMenu');
    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="report-menu stack-md">
            <div className="report-menu__title padding-md-lg inline-md text-color-primary">
                <ExclamationIcon className="icon-color-primary"/>
                <span>{t('title')}</span>
            </div>
            <div className="report-menu__container stack-sm">
                <BottomMenuButton
                    label={t('offensive')}
                    onClick={() => { onSelect('offensive'); onClose(); }} />
                <BottomMenuButton
                    label={t('unverified')}
                    onClick={() => { onSelect('unverified'); onClose(); }} />
                <BottomMenuButton
                    label={t('inappropriate')}
                    onClick={() => { onSelect('inappropriate'); onClose(); }} />
                <BottomMenuButton
                    label={t('identifiable')}
                    onClick={() => { onSelect('identifiable'); onClose(); }} />
                <BottomMenuButton
                    label={t('adult')}
                    onClick={() => { onSelect('adult'); onClose(); }} />
            </div>
        </BottomSheet>
    )
}
