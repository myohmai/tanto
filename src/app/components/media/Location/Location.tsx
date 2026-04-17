import { LocationIcon } from "@/app/components/icons";
import { PulldownArrow } from "@/app/components/buttons/PulldownArrow";
import React, { useState } from 'react'

import './Location.scss'

type MediaSource = 'youtube' | 'spotify' | 'appleMusic' | 'other';

export type LocationItem = {
    type: MediaSource;
    url: string;
}

const services = {
    youtube: "YouTube",
    spotify: "Spotify",
    appleMusic: "Apple Music",
    other: "WEB"
} as const;

type Props = {
    sources: LocationItem[];
}

export const Location = ({ sources }: Props ) => {
    const [isOpen, setIsOpen] = useState(false);
    const primaryItem = sources[0];
    const primary = sources[0]?.type;
    const primaryService = primary ? services[primary] : '';
    return (
        <div className="location text-color-secondary inline-xs">
            <LocationIcon size="md" className="icon-color-secondary" />
            <span><a href={primaryItem?.url} className="text-color-secondary">{primaryService}</a></span>
            <div className={`location__pulldown--wrapper inline-xs ${isOpen? 'open bg-color-secondary' : ''}`}>
                <ul className={`location__pulldown stack-sm ${isOpen? 'open' : ''}`}>
                    {sources.map((s) =>{
                            const serviceName = services[s.type];
                            return(
                                <li key={s.url} className="location__pulldown--list">
                                    <a href={s.url} className="location__pulldown--link text-color-secondary">{serviceName}</a>
                                </li>
                            );
                        })}
                </ul>
                <PulldownArrow onToggle={() => {
                    setIsOpen((prev) => !prev);
                }} isOpen={isOpen} />
            </div>
        </div>
    );

}