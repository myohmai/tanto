ALTER TABLE blocks
    ADD COLUMN room_id               UUID    REFERENCES rooms(room_id) ON DELETE SET NULL,
    ADD COLUMN is_anonymous          BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN target_snapshot_name  TEXT,
    ADD COLUMN target_snapshot_icon  TEXT;
