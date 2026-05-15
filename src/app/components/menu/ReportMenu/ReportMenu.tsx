'use client';
import { BottomSheet } from "@/app/components/menu/BottomSheet";
import { BottomMenuButton } from "@/app/components/menu/BottomMenuButton";
import { ExclamationIcon } from "@/app/components/icons";

import { ReportType } from "@/app/types/report";

import './ReportMenu.scss'


type Props = {
    onSelect: (reason: ReportType) => void;
    isOpen: boolean;
    onClose: () => void;
}

export const ReportMenu = ({ onSelect, isOpen, onClose }: Props ) => {
    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName="report-menu stack-md">
            <div className="report-menu__title padding-md-lg inline-md text-color-primary">
                <ExclamationIcon className="icon-color-primary"/>
                <span>Report this Gloss</span>
            </div>
            <div className="report-menu__container stack-sm">
                <BottomMenuButton
                    label="Offensive content"
                    onClick={() => {
                        onSelect('offensive');
                        onClose();
                        }} />
                <BottomMenuButton
                    label="Unverified information"
                    onClick={() => {
                        onSelect('unverified');
                        onClose();
                        }} />
                <BottomMenuButton 
                    label="Inappropriate content" 
                    onClick={() => {
                        onSelect('inappropriate');
                        onClose();
                        }} />
                <BottomMenuButton 
                    label="Personally identifiable information" 
                    onClick={() => {
                        onSelect('identifiable');
                        onClose();
                        }} />
                <BottomMenuButton 
                    label="Adult content" 
                    onClick={() => {
                        onSelect('adult');
                        onClose();
                    }} />
            </div>
        </BottomSheet>
    )
}