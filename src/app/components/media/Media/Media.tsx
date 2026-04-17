import { MediaLabel, MediaLabelType, Lang } from "@/app/components/media/MediaLabel";
import { ArrowLeftIcon, ArrowRightIcon, CancelIcon } from '@/app/components/icons';

import "./Media.scss"

import React, { useState, useEffect } from "react";

export type MediaItem = {
    type: "image" | "video";
    url: string;
};

type Props = {
    source: MediaItem[];
    type: MediaLabelType;
    lang: Lang;
}

export const Media = ( { source, type, lang }: Props ) => {
    const items = source.slice(0, 4);
    const [activeIndex, setActiveIndex] = useState< number | null>(null);
    const [startX, setStartX] = useState<number | null>(null);

    const renderItem = (item: MediaItem, i: number) =>{
        switch (item.type) {
            case "image":
                return <img key={i} src={item.url} onClick={() => setActiveIndex(i)}/>;
            case "video":
                return <video key={i} src={item.url} controls onClick={() => setActiveIndex(i)}/>
            default:
                return null;
        }
    };
    const handleNext = () => {
        if (activeIndex === null || activeIndex === items.length - 1) return;
        setActiveIndex(activeIndex + 1);
    };

    const handlePrev = () => {
        if (activeIndex === null || activeIndex === 0) return;
        setActiveIndex(activeIndex - 1);
    };
    const handlePointerDown = (e: React.PointerEvent) => {
    setStartX(e.clientX);
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (startX === null) return;

        const diff = e.clientX - startX;

        if (diff > 50) {
            handlePrev();
        } else if (diff < -50) {
            handleNext();
        }

        setStartX(null);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setActiveIndex(null);
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
        }, []);

    useEffect(() => {
            document.body.style.overflow = activeIndex !== null ? "hidden" : "";
        }, [activeIndex]);
        
    const mediaContent = (() => {
        switch (items.length) {
            case 1:
                return(
                    <div className="media-item one">
                        {renderItem(items[0],0)}
                    </div>
                );
            case 2:
                return(
                    <div className="media-item two">
                        {items.map((item,i) => renderItem(item, i))}
                    </div>
                );
            case 3:
                return(
                    <div className="media-item three">
                        {items.map((item,i) => renderItem(item, i))}
                    </div>
                );
            case 4:
                return(
                    <div className="media-item four">
                        {items.map((item,i) => renderItem(item, i))}
                    </div>
                );
            default:
                return null;
        }
    })();
    return (
        <div className="media stack-sm">
            {mediaContent}
            {activeIndex !== null && (
                <div className="media-modal" onClick={() => setActiveIndex(null)}>
                    <button className="media-modal__escape" onClick={(e) => { e.stopPropagation(); setActiveIndex(null); }}>
                        <CancelIcon size="md" className="media-modal__cancel"/>
                    </button>
                    {activeIndex !== 0 && (
                        <button className="prev media-modal__arrow" onClick={(e) => { e.stopPropagation(); handlePrev(); }}>
                            <ArrowLeftIcon size="sm" className="media-modal__arrow-icon"/>
                        </button>
                    )}
                    <div className="media-modal-content" onClick={(e) => e.stopPropagation()} onPointerDown={handlePointerDown} onPointerUp={handlePointerUp}>
                    {items[activeIndex].type === "image" ? (
                        <img src={items[activeIndex].url} />
                    ) : (
                        <video src={items[activeIndex].url} controls autoPlay />
                    )}
                    </div>
                    {activeIndex !== items.length - 1 && (
                        <button className="next media-modal__arrow" onClick={(e) => { e.stopPropagation(); handleNext(); }}>
                            <ArrowRightIcon size="sm" className="media-modal__arrow-icon"/>
                        </button>
                    )}
                </div>
            )}
            <MediaLabel type={type} lang={lang} />
        </div>
    )
}