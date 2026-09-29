-- =====================================================
-- OpenRoom の TurnTable リクエスト承認フロー
--
-- 問題:
--   - song_requests / votes に RLS が定義されていなかった
--   - リクエストの status を approved / rejected / timeout に更新する処理が無く、
--     投票しても pending のままだった
--   - OpenRoom のメンバーが turntables に直接 INSERT でき、投票を経由しなかった
--   - UI では admin が OpenRoom の TurnTable を削除できるが、RLS がホストのみ許可していた
--
-- 承認ルール(resolve_song_requests):
--   - 投票率 = 投票数 / アクティブメンバー数(active_members、最低 1)
--   - 投票率 30% 以上で判定する
--       賛成が過半数 → approved(turntables に追加)
--       反対が過半数 → rejected
--       同数        → pending のまま
--   - expires_at(作成から30日)を過ぎた pending → timeout
-- =====================================================

-- 1. RLS
ALTER TABLE song_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes         ENABLE ROW LEVEL SECURITY;

-- Room が見えるならリクエストも見える(rooms の SELECT ポリシーが効く)
DROP POLICY IF EXISTS "song_requests_select" ON song_requests;
CREATE POLICY "song_requests_select"
    ON song_requests FOR SELECT
    USING (EXISTS (SELECT 1 FROM rooms WHERE rooms.room_id = song_requests.room_id));

-- Room メンバーが自分名義でのみ作成可
DROP POLICY IF EXISTS "song_requests_insert" ON song_requests;
CREATE POLICY "song_requests_insert"
    ON song_requests FOR INSERT
    WITH CHECK (
        requested_by = auth.uid()
        AND EXISTS (
            SELECT 1 FROM user_rooms
            WHERE user_rooms.room_id = song_requests.room_id
            AND user_rooms.user_id = auth.uid()
        )
    );

-- 自分のリクエストのみ削除可(status の更新は resolve_song_requests だけが行う)
DROP POLICY IF EXISTS "song_requests_delete" ON song_requests;
CREATE POLICY "song_requests_delete"
    ON song_requests FOR DELETE
    USING (requested_by = auth.uid());

DROP POLICY IF EXISTS "votes_select" ON votes;
CREATE POLICY "votes_select"
    ON votes FOR SELECT
    USING (EXISTS (SELECT 1 FROM song_requests sr WHERE sr.id = votes.request_id));

-- 投票は Room メンバーが pending のリクエストに対してのみ
DROP POLICY IF EXISTS "votes_insert" ON votes;
CREATE POLICY "votes_insert"
    ON votes FOR INSERT
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM song_requests sr
            JOIN user_rooms ur ON ur.room_id = sr.room_id AND ur.user_id = auth.uid()
            WHERE sr.id = votes.request_id
            AND sr.status = 'pending'
        )
    );

DROP POLICY IF EXISTS "votes_update" ON votes;
CREATE POLICY "votes_update"
    ON votes FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (
        user_id = auth.uid()
        AND EXISTS (
            SELECT 1
            FROM song_requests sr
            JOIN user_rooms ur ON ur.room_id = sr.room_id AND ur.user_id = auth.uid()
            WHERE sr.id = votes.request_id
            AND sr.status = 'pending'
        )
    );

GRANT SELECT, INSERT, DELETE ON song_requests TO authenticated;
GRANT SELECT, INSERT, UPDATE ON votes TO authenticated;
GRANT SELECT ON active_members TO authenticated;

-- 2. turntables: 直接追加はホスト / OpenRoom の admin のみ(メンバーはリクエスト経由)
DROP POLICY IF EXISTS "turntables_insert" ON turntables;
CREATE POLICY "turntables_insert"
    ON turntables FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = turntables.room_id
            AND (
                rooms.host_user_id = auth.uid()
                OR (
                    rooms.is_open_room = TRUE
                    AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
                )
            )
        )
    );

DROP POLICY IF EXISTS "turntables_delete" ON turntables;
CREATE POLICY "turntables_delete"
    ON turntables FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM rooms
            WHERE rooms.room_id = turntables.room_id
            AND (
                rooms.host_user_id = auth.uid()
                OR (
                    rooms.is_open_room = TRUE
                    AND EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid())
                )
            )
        )
    );

-- 3. 承認判定
CREATE OR REPLACE FUNCTION resolve_song_requests(p_room_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_req     song_requests%ROWTYPE;
    v_total   INTEGER;
    v_yes     INTEGER;
    v_active  INTEGER;
BEGIN
    IF auth.uid() IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- 期限切れ
    UPDATE song_requests
    SET status = 'timeout'
    WHERE room_id = p_room_id
      AND status = 'pending'
      AND expires_at < NOW();

    SELECT COALESCE(MAX(active_count), 0)::int INTO v_active
    FROM active_members
    WHERE room_id = p_room_id;
    v_active := GREATEST(v_active, 1);

    FOR v_req IN
        SELECT * FROM song_requests
        WHERE room_id = p_room_id AND status = 'pending'
        ORDER BY created_at
        FOR UPDATE
    LOOP
        SELECT COUNT(*)::int, (COUNT(*) FILTER (WHERE approved))::int
        INTO v_total, v_yes
        FROM votes
        WHERE request_id = v_req.id;

        -- 投票率 30% 未満はまだ判定しない
        CONTINUE WHEN v_total::numeric / v_active < 0.3;

        IF v_yes * 2 > v_total THEN
            UPDATE song_requests SET status = 'approved' WHERE id = v_req.id;

            IF v_req.type = 'video' THEN
                INSERT INTO turntables (room_id, type, video)
                VALUES (
                    v_req.room_id,
                    'video',
                    jsonb_build_object(
                        'videoId',     COALESCE(v_req.metadata->>'videoId', ''),
                        'title',       COALESCE(v_req.metadata->>'title', ''),
                        'channelName', COALESCE(v_req.metadata->>'channelName', ''),
                        'url',         v_req.url
                    )
                );
            ELSE
                INSERT INTO turntables (room_id, type, music)
                VALUES (
                    v_req.room_id,
                    'music',
                    jsonb_build_object(
                        'title',   COALESCE(v_req.metadata->>'title', ''),
                        'artist',  COALESCE(v_req.metadata->>'artist', ''),
                        'cover',   v_req.metadata->>'thumbnail',
                        'service', COALESCE(v_req.metadata->>'service', 'spotify'),
                        'url',     v_req.url
                    )
                );
            END IF;
        ELSIF (v_total - v_yes) * 2 > v_total THEN
            UPDATE song_requests SET status = 'rejected' WHERE id = v_req.id;
        END IF;
    END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION resolve_song_requests(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION resolve_song_requests(UUID) TO authenticated;
