import { supabase } from '@/lib/supabase';
import type { RoomData } from '@/app/types/room';
import type { Report } from '@/app/types/report';

type RoomRow = {
    room_id: string;
    room_banner_url: string | null;
    room_icon_url: string | null;
    room_name: string;
    room_information: string;
    tags: string[];
    room_rule: string;
    room_member_ini: RoomData['roomMemberIni'] | null;
    room_visibility: 'public' | 'private';
    room_entry_setting: 'quiz' | 'keyword' | null;
    room_key_word: string | null;
    room_key_word_hint: string | null;
    room_quiz: RoomData['roomQuiz'] | null;
    room_quiz_score: number | null;
    host_user_id: string | null;
    host_snapshot: RoomData['roomHost'] | null;
    host_create_salon: boolean;
    entity_ids: string[];
    room_reports: { reporter_id: string; type: string; created_at: string }[];
    room_stats: { member_count: number; gloss_count: number; recent_gloss_count: number }[];
};

const toRoomData = (row: RoomRow): RoomData => ({
    roomId:           row.room_id,
    roomBannerUrl:    row.room_banner_url ?? null,
    roomIconUrl:      row.room_icon_url ?? null,
    roomName:         row.room_name,
    roomInformation:  row.room_information,
    tags:             row.tags,
    roomRule:         row.room_rule,
    roomMemberIni:    row.room_member_ini ?? { iconUrl: null, initialName: null },
    roomVisibility:   row.room_visibility,
    roomEntrySetting: row.room_entry_setting ?? undefined,
    roomKeyWord:      row.room_key_word ?? undefined,
    roomKeyWordHint:  row.room_key_word_hint ?? undefined,
    roomQuiz:         row.room_quiz ?? null,
    roomQuizScore:    row.room_quiz_score ?? undefined,
    roomHost:         row.host_snapshot ?? undefined,
    hostCreateSalon:  row.host_create_salon,
    entityIds:        row.entity_ids,
    reports:          (row.room_reports ?? []).map(r => ({
        reporterId: r.reporter_id,
        type:       r.type as Report['type'],
        createdAt:  new Date(r.created_at).getTime(),
    })),
    roomMemberCount:    row.room_stats?.[0]?.member_count ?? 0,
    glossCount:         row.room_stats?.[0]?.gloss_count ?? 0,
    recentGlossCount:   row.room_stats?.[0]?.recent_gloss_count ?? 0,
});

const ROOM_SELECT = `
    *,
    room_reports(reporter_id, type, created_at),
    room_stats(member_count, gloss_count, recent_gloss_count)
`;

export const getRooms = async (): Promise<RoomData[]> => {
    const { data, error } = await supabase
        .from('rooms')
        .select(ROOM_SELECT)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return (data as RoomRow[]).map(toRoomData);
};

export const getRoomById = async (roomId: string): Promise<RoomData | null> => {
    const { data, error } = await supabase
        .from('rooms')
        .select(ROOM_SELECT)
        .eq('room_id', roomId)
        .single();

    if (error) return null;
    return toRoomData(data as RoomRow);
};

export const saveRoom = async (room: RoomData) => {
    const payload = {
        room_id:            room.roomId,
        room_banner_url:    room.roomBannerUrl ?? null,
        room_icon_url:      room.roomIconUrl ?? null,
        room_name:          room.roomName,
        room_information:   room.roomInformation,
        tags:               room.tags,
        room_rule:          room.roomRule,
        room_member_ini:    room.roomMemberIni,
        room_visibility:    room.roomVisibility,
        room_entry_setting: room.roomEntrySetting ?? null,
        room_key_word:      room.roomKeyWord ?? null,
        room_key_word_hint: room.roomKeyWordHint ?? null,
        room_quiz:          room.roomQuiz ?? null,
        room_quiz_score:    room.roomQuizScore ?? null,
        host_user_id:       room.roomHost?.userId ?? null,
        host_snapshot:      room.roomHost ?? null,
        host_create_salon:  room.hostCreateSalon,
        entity_ids:         room.entityIds,
    };

    const { error } = await supabase
        .from('rooms')
        .upsert(payload, { onConflict: 'room_id' });

    if (error) throw error;
};

export const deleteRoom = async (roomId: string) => {
    const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('room_id', roomId);

    if (error) throw error;
};
