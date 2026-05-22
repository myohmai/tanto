-- =====================================================
-- Initial Schema: TanTo
-- =====================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE room_visibility_type AS ENUM ('public', 'private');
CREATE TYPE room_entry_setting_type AS ENUM ('quiz', 'keyword');
CREATE TYPE report_type AS ENUM ('offensive', 'unverified', 'inappropriate', 'identifiable', 'adult');
CREATE TYPE entity_type AS ENUM ('external', 'tag');
CREATE TYPE entity_merge_proposal_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE turntable_type AS ENUM ('video', 'music');
CREATE TYPE music_service AS ENUM ('youtube', 'spotify', 'appleMusic');
CREATE TYPE media_label_type AS ENUM ('fanArt', 'official', 'original', 'quote', 'ai');

-- =====================================================
-- ENTITIES (dependency for rooms)
-- =====================================================

CREATE TABLE entities (
    entity_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label           TEXT NOT NULL,
    entity_type     entity_type NOT NULL,
    canonical_entity_id UUID REFERENCES entities(entity_id) ON DELETE SET NULL,
    parent_entity_id    UUID REFERENCES entities(entity_id) ON DELETE SET NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_entities_type ON entities(entity_type);

-- =====================================================
-- ROOMS
-- =====================================================

CREATE TABLE rooms (
    room_id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_banner_url     TEXT,
    room_icon_url       TEXT,
    room_name           TEXT NOT NULL,
    room_information    TEXT NOT NULL DEFAULT '',
    tags                TEXT[] NOT NULL DEFAULT '{}',
    room_rule           TEXT NOT NULL DEFAULT '',
    -- { iconUrl: string | null, initialName: string | null }
    room_member_ini     JSONB,
    room_visibility     room_visibility_type NOT NULL DEFAULT 'public',
    room_entry_setting  room_entry_setting_type,
    room_key_word       TEXT,
    room_key_word_hint  TEXT,
    -- QuizeList[]: [{ id, question, option: [{...}] }]
    room_quiz           JSONB,
    room_quiz_score     INTEGER,
    host_user_id        UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    -- { userId, iconUrl, userName, subIcon }
    host_snapshot       JSONB,
    host_create_salon   BOOLEAN NOT NULL DEFAULT FALSE,
    entity_ids          UUID[] NOT NULL DEFAULT '{}',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_host_user_id ON rooms(host_user_id);
CREATE INDEX idx_rooms_visibility ON rooms(room_visibility);

-- =====================================================
-- SALONS
-- =====================================================

CREATE TABLE salons (
    salon_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id     UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    salon_name  TEXT NOT NULL,
    -- { type: 'emoji' | 'fond', value: string }
    salon_icon  JSONB NOT NULL,
    is_topic_box BOOLEAN NOT NULL DEFAULT FALSE,
    is_pinned   BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_salons_room_id ON salons(room_id);

-- =====================================================
-- TOPICS
-- =====================================================

CREATE TABLE topics (
    topic_id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id         UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    salon_id        UUID NOT NULL REFERENCES salons(salon_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_content   TEXT NOT NULL,
    -- { source: MediaItem[], type: media_label_type | null }
    media           JSONB,
    -- { url: string }
    media_embed     JSONB,
    posted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_topics_salon_id ON topics(salon_id);
CREATE INDEX idx_topics_user_id ON topics(user_id);

-- =====================================================
-- GLOSSES
-- =====================================================

CREATE TABLE glosses (
    gloss_id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id             UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    salon_id            UUID REFERENCES salons(salon_id) ON DELETE SET NULL,
    user_id             UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    content             TEXT NOT NULL,
    -- { source: MediaItem[], type: media_label_type | null }
    media               JSONB,
    -- { url: string }
    media_embed         JSONB,
    -- { yesCount: number, noCount: number }
    revaluation         JSONB,
    topic_id            UUID REFERENCES topics(topic_id) ON DELETE SET NULL,
    posted_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reply_to_gloss_id   UUID REFERENCES glosses(gloss_id) ON DELETE SET NULL
);

CREATE INDEX idx_glosses_salon_id ON glosses(salon_id);
CREATE INDEX idx_glosses_user_id ON glosses(user_id);
CREATE INDEX idx_glosses_reply_to ON glosses(reply_to_gloss_id);
CREATE INDEX idx_glosses_posted_at ON glosses(posted_at DESC);

-- =====================================================
-- REPORTS (glosses / rooms)
-- =====================================================

CREATE TABLE gloss_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gloss_id    UUID NOT NULL REFERENCES glosses(gloss_id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        report_type NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (gloss_id, reporter_id, type)
);

CREATE INDEX idx_gloss_reports_gloss_id ON gloss_reports(gloss_id);

CREATE TABLE room_reports (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id     UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type        report_type NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (room_id, reporter_id, type)
);

CREATE INDEX idx_room_reports_room_id ON room_reports(room_id);

-- =====================================================
-- FONDS
-- =====================================================

CREATE TABLE fonds (
    gloss_id    UUID NOT NULL REFERENCES glosses(gloss_id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (gloss_id, user_id)
);

CREATE INDEX idx_fonds_user_id ON fonds(user_id);

-- =====================================================
-- TURNTABLES
-- =====================================================

CREATE TABLE turntables (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_id     UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    type        turntable_type NOT NULL,
    -- { videoId, title, channelName, url }
    video       JSONB,
    -- { title, artist, cover, service, url }
    music       JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_turntables_room_id ON turntables(room_id);

-- =====================================================
-- USER_ROOMS (参加情報)
-- =====================================================

CREATE TABLE user_rooms (
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id     UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    room_name   TEXT,
    icon_url    TEXT,
    -- { type: 'emoji' | 'fond', value: string }
    sub_icon    JSONB,
    user_name   TEXT,
    joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, room_id)
);

CREATE INDEX idx_user_rooms_room_id ON user_rooms(room_id);

-- =====================================================
-- BLOCKS
-- =====================================================

CREATE TABLE blocks (
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_user_id  UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, target_user_id),
    CHECK (user_id <> target_user_id)
);

-- =====================================================
-- MUTES
-- =====================================================

CREATE TABLE mutes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id     UUID REFERENCES rooms(room_id) ON DELETE CASCADE,
    salon_id    UUID REFERENCES salons(salon_id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (room_id IS NOT NULL OR salon_id IS NOT NULL)
);

CREATE INDEX idx_mutes_user_id ON mutes(user_id);

-- =====================================================
-- USER_ROOM_ENTITIES (UserInterest)
-- =====================================================

CREATE TABLE user_room_entities (
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    room_id     UUID NOT NULL REFERENCES rooms(room_id) ON DELETE CASCADE,
    entity_id   UUID NOT NULL REFERENCES entities(entity_id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, room_id, entity_id)
);

CREATE INDEX idx_user_room_entities_user_id ON user_room_entities(user_id);
CREATE INDEX idx_user_room_entities_entity_id ON user_room_entities(entity_id);

-- =====================================================
-- USER_DIS_INTERESTS
-- =====================================================

CREATE TABLE user_dis_interests (
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    entity_id   UUID NOT NULL REFERENCES entities(entity_id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, entity_id)
);

-- =====================================================
-- ENTITY_MERGE_PROPOSALS
-- =====================================================

CREATE TABLE entity_merge_proposals (
    proposal_id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_entity_id    UUID NOT NULL REFERENCES entities(entity_id) ON DELETE CASCADE,
    target_entity_id    UUID NOT NULL REFERENCES entities(entity_id) ON DELETE CASCADE,
    proposed_by         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    approved_by         UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status              entity_merge_proposal_status NOT NULL DEFAULT 'pending',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (source_entity_id <> target_entity_id)
);

CREATE INDEX idx_entity_merge_proposals_status ON entity_merge_proposals(status);

-- =====================================================
-- TOPIC BOOKMARKS
-- =====================================================

CREATE TABLE topic_bookmarks (
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    topic_id    UUID NOT NULL REFERENCES topics(topic_id) ON DELETE CASCADE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, topic_id)
);

-- =====================================================
-- COMPUTED VIEWS
-- =====================================================

-- gloss_statsはクエリで毎回計算するのを避けるためのビュー
CREATE VIEW gloss_stats AS
SELECT
    g.gloss_id,
    COUNT(DISTINCT f.user_id)                   AS fond_count,
    COUNT(DISTINCT r.id)                        AS report_count,
    COUNT(DISTINCT reply.gloss_id)              AS reply_count
FROM glosses g
LEFT JOIN fonds f         ON f.gloss_id = g.gloss_id
LEFT JOIN gloss_reports r ON r.gloss_id = g.gloss_id
LEFT JOIN glosses reply   ON reply.reply_to_gloss_id = g.gloss_id
GROUP BY g.gloss_id;

-- room_statsはRoomのアクティビティスコア計算用
CREATE VIEW room_stats AS
SELECT
    r.room_id,
    COUNT(DISTINCT ur.user_id)                  AS member_count,
    COUNT(DISTINCT g.gloss_id)                  AS gloss_count,
    COUNT(DISTINCT g_recent.gloss_id)           AS recent_gloss_count
FROM rooms r
LEFT JOIN user_rooms ur ON ur.room_id = r.room_id
LEFT JOIN glosses g     ON g.room_id = r.room_id
LEFT JOIN glosses g_recent
    ON g_recent.room_id = r.room_id
    AND g_recent.posted_at > NOW() - INTERVAL '24 hours'
GROUP BY r.room_id;
