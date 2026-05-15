import { RoomCustomIcon, RoomCustomIconProps } from "@/app/components/custom-icon/RoomCustomIcon";
import { FondLevel } from "@/app/components/icons"; 
import { RoomUtilityContainer } from "@/app/components/container/RoomUtilityContainer";
import { RoomEnterButton  } from "@/app/components/buttons/RoomEnterButton";
import { TagChip } from "@/app/components/tag/TagChip";
import { HostIcon, LockIcon, CancelIcon } from "@/app/components/icons";
import { RoomMenu } from "@/app/components/menu/RoomMenu";
import { ReportMenu } from "@/app/components/menu/ReportMenu";
import type { Report,ReportType } from "@/app/types/report";

import type { RoomData } from "@/app/types/room";

import { useState, useEffect, useRef } from "react";

import './RoomInfo.scss'

type RoomInfoProps = {
    roomData : RoomData;
    subIcon?: { type: 'fond'; value: FondLevel };
    onSearch: () => void;
    onEdit: () => void;
    onEnter: () => void;
    onShare: () => void;
    onMute: () => void;
    onSelect: (reason: Report) => void;
    isEntered: boolean;
}

export const RoomInfo = ({ roomData, subIcon, onSearch, onEdit, onEnter, onShare, onMute, onSelect, isEntered }: RoomInfoProps) => {
    const [expanded, setExpanded] = useState(false);
    const [overflow, setOverflow] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [ruleOpen, setRuleOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [reportOpen, setReportOpen] = useState(false)

    const handleReport = (type: ReportType) => {
    onSelect({
            type,
            createdAt: Date.now()
        });
    };


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
        }, [roomData.roomInformation]);
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
                <img src={roomData.roomBannerUrl || '/images/default.png'} alt="Room Banner" className="room-info__banner--image"/>
            </div>
            <div className="room-info__container bg-color-primary stack-md">
                <RoomCustomIcon roomIconUrl={roomData.roomIconUrl} subIcon={subIcon} className="room-info__icon" />
                <RoomUtilityContainer onSearch={onSearch} onEdit={onEdit} onMenu={() => setMenuOpen(true)} className="room-info__utility" />
                <RoomEnterButton isInRoom={false} isEntered={isEntered} onClick={onEnter} className="room-info__enter-button" />
                <div className="room-info__name inline-sm">
                    <span className="room-info__name--name">{roomData.roomName}</span>
                    {roomData.roomVisibility === "public" ? <HostIcon size="sm" className="room-info__name--icon icon-color-secondary" /> : ""}
                    {roomData.roomVisibility === "private" ? <><HostIcon size="sm" className="room-info__name--icon icon-color-secondary" /><LockIcon size="sm" className="room-info__name--icon icon-color-secondary" /></> : ""}
                </div>
                <div className="room-info__information-wrap">
                    <div ref={ref} className={`room-info__information ${expanded ? "is-open" : ""}`}>{roomData.roomInformation}</div>
                    {overflow && !expanded && (<div className="room-info__information--more bg-color-primary">...<button onClick={() => setExpanded(true)}>more</button></div>)}
                </div>
                <div className="room-info__rule">
                    {ruleOpen && (
                        <div className="room-info__backdrop" onClick={()=>setRuleOpen(false)} />
                    )}
                    <button
                        type="button"
                        className="room-info__rule-button bg-color-secondary padding-xs-md"
                        onClick={() => setRuleOpen(true)}
                    >
                        Room Rules
                    </button>
                    <div className={`room-info__rule-wrapper bg-color-secondary ${ruleOpen ? "is-open" : ""}`}>
                        <button
                            type="button"
                            className="room-info__rule-cancel"
                            onClick={() => setRuleOpen(false)}
                            >
                            <CancelIcon className="icon-color-primary" />
                        </button>
                        <div className="room-info__rule-content">{roomData.roomRule}</div>
                    </div>
                </div>
                <div className="room-info__tag inline-sm">
                    {roomData.tags.map((tag) => (
                        <TagChip key={tag} label={tag} />
                    ))}
                </div>
                <div className="room-info__members">{formatMemberCount(roomData.roomMemberCount)} gathering here</div>
            </div>
            <RoomMenu onShare={onShare} onMute={onMute} onReport={() => setReportOpen(true)} onClose={() => setMenuOpen(false)} isOpen={menuOpen} />
            <ReportMenu onSelect={handleReport} isOpen={reportOpen} onClose={() => setReportOpen(false)} />
        </div>
    )
}