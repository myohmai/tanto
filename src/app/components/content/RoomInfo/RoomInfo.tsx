import { RoomCustomIcon, RoomCustomIconProps } from "@/app/components/custom-icon/RoomCustomIcon";
import { FondLevel } from "@/app/components/icons"; 
import { RoomUtilityContainer } from "@/app/components/container/RoomUtilityContainer";
import { RoomEnterButton  } from "@/app/components/buttons/RoomEnterButton";
import { TagChip } from "@/app/components/tag/TagChip";
import { HostIcon, LockIcon } from "@/app/components/icons";

import { useState, useEffect, useRef } from "react";

import './RoomInfo.scss'

type RoomInfoProps = {
    bannerUrl?: string;
    roomIconUrl?: string;
    subIcon?: { type: 'fond'; value: FondLevel };
    onSearch: () => void;
    onEdit: () => void;
    onMenu: () => void;
    onEnter: () => void;
    isEntered: boolean;
    isPublic: boolean;
    isPrivate: boolean;
    roomName: string;
    roomInformation: string;
    roomMember: number;
    tags: string[];
}

export const RoomInfo = ({ bannerUrl, roomIconUrl, subIcon, onSearch, onEdit, onMenu, onEnter, isEntered, isPublic, isPrivate, roomName, roomInformation, roomMember, tags }: RoomInfoProps) => {
    const [expanded, setExpanded] = useState(false);
    const [overflow, setOverflow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const checkOverflow = () => {
        if (ref.current) {
                setOverflow(ref.current.scrollHeight > ref.current.clientHeight + 2);
            }
        };

        useEffect(() => {
            checkOverflow();

            const id = requestAnimationFrame(checkOverflow);
            window.addEventListener("resize", checkOverflow);

            return () => {
                    cancelAnimationFrame(id);
                    window.removeEventListener("resize", checkOverflow);
                };
        }, [roomInformation]);
    const formatMemberCount = (count: number, locale = "ja") => {
        if (locale === "ja") {
            if (count >= 100000000) return `${(count / 100000000).toFixed(1)}億`;
            if (count >= 10000) return `${(count / 10000).toFixed(1)}万`;
            return count.toLocaleString("ja-JP");
        }

        if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
        if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toLocaleString("en-US");
    };
    const trim = (num: number) => num.toFixed(1).replace(".0", "");
    return (
        <div className="room-info text-color-primary">
            <div className="room-info__banner">
                <img src={bannerUrl || '/images/default.png'} alt="Room Banner" className="room-info__banner--image"/>
            </div>
            <div className="room-info__container bg-color-primary stack-md">
                <RoomCustomIcon roomIconUrl={roomIconUrl} subIcon={subIcon} className="room-info__icon" />
                <RoomUtilityContainer onSearch={onSearch} onEdit={onEdit} onMenu={onMenu} className="room-info__utility" />
                <RoomEnterButton isInRoom={false} isEntered={isEntered} onClick={onEnter} className="room-info__enter-button" />
                <div className="room-info__name inline-sm">
                    <span className="room-info__name--name">{roomName}</span>
                    {isPublic ? <HostIcon size="sm" className="room-info__name--icon icon-color-secondary" /> : ""}
                    {isPrivate? <><HostIcon size="sm" className="room-info__name--icon icon-color-secondary" /><LockIcon size="sm" className="room-info__name--icon icon-color-secondary" /></> : ""}
                </div>
                <div className="room-info__information-wrap">
                    <div ref={ref} className={`room-info__information ${expanded ? "is-open" : ""}`}>{roomInformation}</div>
                    {overflow && !expanded && (<div className="room-info__information--more bg-color-primary">...<button onClick={() => setExpanded(true)}>more</button></div>)}
                </div>
                <div className="room-info__tag inline-sm">
                    {tags.map((tag) => (
                        <TagChip key={tag} label={tag} />
                    ))}
                </div>
                <div className="room-info__members">{formatMemberCount(roomMember)} gathering here</div>
            </div>
        </div>
    )
}