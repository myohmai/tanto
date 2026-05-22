ALTER TABLE song_requests
    ADD COLUMN type turntable_type NOT NULL DEFAULT 'music';

CREATE INDEX idx_song_requests_type ON song_requests(type);
