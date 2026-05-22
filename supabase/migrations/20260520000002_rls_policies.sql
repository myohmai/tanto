-- =====================================================
-- Row Level Security Policies
-- =====================================================

-- RLS有効化
ALTER TABLE rooms               ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons              ENABLE ROW LEVEL SECURITY;
ALTER TABLE glosses             ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics              ENABLE ROW LEVEL SECURITY;
ALTER TABLE fonds               ENABLE ROW LEVEL SECURITY;
ALTER TABLE gloss_reports       ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_reports        ENABLE ROW LEVEL SECURITY;
ALTER TABLE turntables          ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rooms          ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocks              ENABLE ROW LEVEL SECURITY;
ALTER TABLE mutes               ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities            ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_room_entities  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dis_interests  ENABLE ROW LEVEL SECURITY;
ALTER TABLE entity_merge_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_bookmarks     ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- rooms
-- =====================================================

-- public roomは誰でも閲覧可
CREATE POLICY "rooms_select_public"
    ON rooms FOR SELECT
    USING (room_visibility = 'public');

-- private roomはメンバーのみ閲覧可
CREATE POLICY "rooms_select_member"
    ON rooms FOR SELECT
    USING (
        room_visibility = 'private'
        AND EXISTS (
            SELECT 1 FROM user_rooms
            WHERE user_rooms.room_id = rooms.room_id
            AND user_rooms.user_id = auth.uid()
        )
    );

-- ログイン済みユーザーが作成可
CREATE POLICY "rooms_insert"
    ON rooms FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- hostのみ編集可
CREATE POLICY "rooms_update"
    ON rooms FOR UPDATE
    USING (host_user_id = auth.uid());

-- hostのみ削除可
CREATE POLICY "rooms_delete"
    ON rooms FOR DELETE
    USING (host_user_id = auth.uid());

-- =====================================================
-- salons
-- =====================================================

-- roomが見えるならsalonも見える
CREATE POLICY "salons_select"
    ON salons FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND (
                rooms.room_visibility = 'public'
                OR EXISTS (
                    SELECT 1 FROM user_rooms
                    WHERE user_rooms.room_id = rooms.room_id
                    AND user_rooms.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "salons_insert"
    ON salons FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND rooms.host_user_id = auth.uid()
        )
    );

CREATE POLICY "salons_update"
    ON salons FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND rooms.host_user_id = auth.uid()
        )
    );

CREATE POLICY "salons_delete"
    ON salons FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = salons.room_id
            AND rooms.host_user_id = auth.uid()
        )
    );

-- =====================================================
-- glosses
-- =====================================================

CREATE POLICY "glosses_select"
    ON glosses FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = glosses.room_id
            AND (
                rooms.room_visibility = 'public'
                OR EXISTS (
                    SELECT 1 FROM user_rooms
                    WHERE user_rooms.room_id = rooms.room_id
                    AND user_rooms.user_id = auth.uid()
                )
            )
        )
    );

-- roomメンバーが投稿可
CREATE POLICY "glosses_insert"
    ON glosses FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM user_rooms
            WHERE user_rooms.room_id = glosses.room_id
            AND user_rooms.user_id = auth.uid()
        )
    );

-- 自分の投稿のみ編集可
CREATE POLICY "glosses_update"
    ON glosses FOR UPDATE
    USING (user_id = auth.uid());

-- 自分の投稿またはhostが削除可
CREATE POLICY "glosses_delete"
    ON glosses FOR DELETE
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = glosses.room_id
            AND rooms.host_user_id = auth.uid()
        )
    );

-- =====================================================
-- topics
-- =====================================================

CREATE POLICY "topics_select"
    ON topics FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = topics.room_id
            AND (
                rooms.room_visibility = 'public'
                OR EXISTS (
                    SELECT 1 FROM user_rooms
                    WHERE user_rooms.room_id = rooms.room_id
                    AND user_rooms.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "topics_insert"
    ON topics FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM user_rooms
            WHERE user_rooms.room_id = topics.room_id
            AND user_rooms.user_id = auth.uid()
        )
    );

CREATE POLICY "topics_delete"
    ON topics FOR DELETE
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = topics.room_id
            AND rooms.host_user_id = auth.uid()
        )
    );

-- =====================================================
-- fonds
-- =====================================================

CREATE POLICY "fonds_select"
    ON fonds FOR SELECT
    USING (true);

CREATE POLICY "fonds_insert"
    ON fonds FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "fonds_delete"
    ON fonds FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- gloss_reports
-- =====================================================

CREATE POLICY "gloss_reports_select"
    ON gloss_reports FOR SELECT
    USING (reporter_id = auth.uid());

CREATE POLICY "gloss_reports_insert"
    ON gloss_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

-- =====================================================
-- room_reports
-- =====================================================

CREATE POLICY "room_reports_select"
    ON room_reports FOR SELECT
    USING (reporter_id = auth.uid());

CREATE POLICY "room_reports_insert"
    ON room_reports FOR INSERT
    WITH CHECK (auth.uid() = reporter_id);

-- =====================================================
-- turntables
-- =====================================================

CREATE POLICY "turntables_select"
    ON turntables FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = turntables.room_id
            AND (
                rooms.room_visibility = 'public'
                OR EXISTS (
                    SELECT 1 FROM user_rooms
                    WHERE user_rooms.room_id = rooms.room_id
                    AND user_rooms.user_id = auth.uid()
                )
            )
        )
    );

CREATE POLICY "turntables_insert"
    ON turntables FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_rooms
            WHERE user_rooms.room_id = turntables.room_id
            AND user_rooms.user_id = auth.uid()
        )
    );

CREATE POLICY "turntables_delete"
    ON turntables FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = turntables.room_id
            AND rooms.host_user_id = auth.uid()
        )
    );

-- =====================================================
-- user_rooms
-- =====================================================

CREATE POLICY "user_rooms_select"
    ON user_rooms FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = user_rooms.room_id
            AND rooms.host_user_id = auth.uid()
        )
    );

CREATE POLICY "user_rooms_insert"
    ON user_rooms FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_rooms_update"
    ON user_rooms FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "user_rooms_delete"
    ON user_rooms FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- blocks
-- =====================================================

CREATE POLICY "blocks_select"
    ON blocks FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "blocks_insert"
    ON blocks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "blocks_delete"
    ON blocks FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- mutes
-- =====================================================

CREATE POLICY "mutes_select"
    ON mutes FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "mutes_insert"
    ON mutes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "mutes_delete"
    ON mutes FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- entities
-- =====================================================

-- 全員が閲覧可
CREATE POLICY "entities_select"
    ON entities FOR SELECT
    USING (true);

-- ログイン済みが作成可（後でadmin roleに絞ることも可）
CREATE POLICY "entities_insert"
    ON entities FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- user_room_entities
-- =====================================================

CREATE POLICY "user_room_entities_select"
    ON user_room_entities FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "user_room_entities_insert"
    ON user_room_entities FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_room_entities_delete"
    ON user_room_entities FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- user_dis_interests
-- =====================================================

CREATE POLICY "user_dis_interests_select"
    ON user_dis_interests FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "user_dis_interests_insert"
    ON user_dis_interests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_dis_interests_delete"
    ON user_dis_interests FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- entity_merge_proposals
-- =====================================================

CREATE POLICY "entity_merge_proposals_select"
    ON entity_merge_proposals FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "entity_merge_proposals_insert"
    ON entity_merge_proposals FOR INSERT
    WITH CHECK (auth.uid() = proposed_by);

-- =====================================================
-- topic_bookmarks
-- =====================================================

CREATE POLICY "topic_bookmarks_select"
    ON topic_bookmarks FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "topic_bookmarks_insert"
    ON topic_bookmarks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "topic_bookmarks_delete"
    ON topic_bookmarks FOR DELETE
    USING (user_id = auth.uid());
