-- =====================================================
-- Song Requests & Votes (Open Room TurnTable approval)
-- =====================================================

CREATE TYPE song_request_status AS ENUM ('pending', 'approved', 'rejected', 'timeout');

CREATE TABLE song_requests (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    requested_by    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    url             TEXT NOT NULL,
    -- { title, artist, thumbnail, service }
    metadata        JSONB NOT NULL DEFAULT '{}',
    status          song_request_status NOT NULL DEFAULT 'pending',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days'
);

CREATE INDEX idx_song_requests_room_id ON song_requests(room_id);
CREATE INDEX idx_song_requests_status  ON song_requests(status);

CREATE TABLE votes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id  UUID NOT NULL REFERENCES song_requests(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    approved    BOOLEAN NOT NULL,
    voted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (request_id, user_id)
);

CREATE INDEX idx_votes_request_id ON votes(request_id);

-- active_members: room ごとに過去30日以内に参加したユーザー数
CREATE VIEW active_members AS
SELECT
    room_id,
    COUNT(DISTINCT user_id) AS active_count
FROM user_rooms
WHERE joined_at > NOW() - INTERVAL '30 days'
GROUP BY room_id;
