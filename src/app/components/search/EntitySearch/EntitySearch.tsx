"use client";
import { useState } from 'react';
import type { ExternalService } from '@/app/types/entity';
import type { SpotifyArtist } from '@/app/api/search/spotify/route';
import type { YouTubeChannel } from '@/app/api/search/youtube/route';
import './EntitySearch.scss';

export type EntityCandidate = {
    externalService: ExternalService;
    externalId: string;
    label: string;
    thumbnailUrl: string | null;
    subLabel?: string;
};

type Props = {
    onSelect: (candidate: EntityCandidate) => void;
    selectedId?: string;
};

export const EntitySearch = ({ onSelect, selectedId }: Props) => {
    const [service, setService] = useState<ExternalService>('spotify');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<EntityCandidate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notConfigured, setNotConfigured] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setError(null);
        setNotConfigured(false);

        try {
            const endpoint = service === 'spotify'
                ? '/api/search/spotify'
                : '/api/search/youtube';

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query }),
            });

            if (res.status === 503) {
                setNotConfigured(true);
                setResults([]);
                return;
            }

            if (!res.ok) {
                setError('検索に失敗しました');
                return;
            }

            const json = await res.json();

            if (service === 'spotify') {
                const artists: SpotifyArtist[] = json.artists ?? [];
                setResults(artists.map(a => ({
                    externalService: 'spotify',
                    externalId: a.id,
                    label: a.name,
                    thumbnailUrl: a.thumbnailUrl,
                    subLabel: a.genres.slice(0, 2).join(', ') || `${a.followers.toLocaleString()} followers`,
                })));
            } else {
                const channels: YouTubeChannel[] = json.channels ?? [];
                setResults(channels.map(c => ({
                    externalService: 'youtube',
                    externalId: c.id,
                    label: c.name,
                    thumbnailUrl: c.thumbnailUrl,
                    subLabel: c.description.slice(0, 60),
                })));
            }
        } catch {
            setError('通信エラーが発生しました');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="entity-search">
            <div className="entity-search__service-tabs">
                {(['spotify', 'youtube'] as ExternalService[]).map(s => (
                    <button
                        key={s}
                        type="button"
                        className={`entity-search__tab${service === s ? ' entity-search__tab--active' : ''}`}
                        onClick={() => { setService(s); setResults([]); setNotConfigured(false); }}
                    >
                        {s === 'spotify' ? 'Spotify' : 'YouTube'}
                    </button>
                ))}
            </div>

            <div className="entity-search__input-row">
                <input
                    className="entity-search__input"
                    type="text"
                    placeholder={service === 'spotify' ? 'アーティスト名を検索' : 'チャンネル名を検索'}
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } }}
                />
                <button
                    type="button"
                    className="entity-search__search-btn"
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? '...' : '検索'}
                </button>
            </div>

            {notConfigured && (
                <div className="entity-search__not-configured">
                    {service === 'spotify' ? 'Spotify' : 'YouTube'} APIキーが未設定です。.env.localに追加してください。
                </div>
            )}

            {error && <div className="entity-search__error">{error}</div>}

            {results.length > 0 && (
                <div className="entity-search__results">
                    {results.map(r => (
                        <button
                            key={r.externalId}
                            type="button"
                            className={`entity-search__result-item${selectedId === r.externalId ? ' entity-search__result-item--selected' : ''}`}
                            onClick={() => onSelect(r)}
                        >
                            {r.thumbnailUrl
                                ? <img className="entity-search__thumbnail" src={r.thumbnailUrl} alt={r.label} />
                                : <div className="entity-search__thumbnail-placeholder" />
                            }
                            <div className="entity-search__result-info">
                                <div className="entity-search__result-name">{r.label}</div>
                                {r.subLabel && (
                                    <div className="entity-search__result-sub">{r.subLabel}</div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
