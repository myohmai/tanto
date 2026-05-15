import { RoomData } from "@/app/types/room";
import { calcRoomActivityScore } from "./roomActivity";
import { FondLevel } from "@/app/components/icons";

const getRoomFondLevel = (
    room: RoomData,
    allRooms: RoomData[]
): FondLevel => {

    const score = calcRoomActivityScore(room);
    const allScores = allRooms.map(calcRoomActivityScore);

    // 初期フェーズ（データ少ない時）
    if (allRooms.length <= 100) {
        if (score < 10) return '100';
        if (score < 30) return '200';
        if (score < 60) return '300';
        if (score < 100) return '400';
        return '500';
    }

    // パーセンタイルフェーズ（データ多い時）
    return getRoomFondLevelByPercentile(score, allScores);
};

const getRoomFondLevelByPercentile = (
    score: number,
    allScores: number[]
): FondLevel => {

    const sorted = [...allScores].sort((a, b) => a - b);
    const rank = sorted.filter(s => s <= score).length;
    const percentile = rank / sorted.length;

    if (percentile > 0.9) return '500';
    if (percentile > 0.7) return '400';
    if (percentile > 0.4) return '300';
    if (percentile > 0.2) return '200';
    return '100';
};

export const getRoomSubIcon = (
    room: RoomData,
    allRooms: RoomData[]
): { type: 'fond'; value: FondLevel } => ({
    type: 'fond',
    value: getRoomFondLevel(room, allRooms),
});