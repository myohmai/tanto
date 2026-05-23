import { NextRequest, NextResponse } from 'next/server';

export type TurnTableMetadata =
    | { type: 'video'; videoId: string; title: string; channelName: string; url: string }
    | { type: 'music'; title: string; artist: string; cover: string | null; service: 'spotify' | 'appleMusic'; url: string };

const extractYouTubeId = (url: string): string | null => {
    try {
        const u = new URL(url);
        if (u.hostname === 'youtu.be') return u.pathname.slice(1);
        return u.searchParams.get('v');
    } catch {
        return null;
    }
};

const isSpotifyTrackUrl = (url: string): boolean => {
    try {
        const u = new URL(url);
        return u.hostname.includes('spotify.com') && u.pathname.includes('/track/');
    } catch {
        return false;
    }
};

export async function POST(req: NextRequest) {
    const { url } = await req.json() as { url?: string };
    if (!url?.trim()) {
        return NextResponse.json({ error: 'url is required' }, { status: 400 });
    }

    // YouTube
    const videoId = extractYouTubeId(url);
    if (videoId) {
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 503 });
        }

        const apiUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
        apiUrl.searchParams.set('id', videoId);
        apiUrl.searchParams.set('part', 'snippet');
        apiUrl.searchParams.set('key', apiKey);

        const res = await fetch(apiUrl.toString());
        if (!res.ok) {
            return NextResponse.json({ error: 'YouTube API error' }, { status: 502 });
        }

        const json = await res.json();
        const snippet = json.items?.[0]?.snippet;
        if (!snippet) {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const metadata: TurnTableMetadata = {
            type: 'video',
            videoId,
            title: snippet.title,
            channelName: snippet.channelTitle,
            url,
        };
        return NextResponse.json(metadata);
    }

    // Spotify - oEmbed（認証不要）
    if (isSpotifyTrackUrl(url)) {
        const oembedRes = await fetch(
            `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`
        );
        if (!oembedRes.ok) {
            return NextResponse.json({ error: `Spotify oEmbed error (${oembedRes.status})` }, { status: 502 });
        }
        const oembed = await oembedRes.json();
        const metadata: TurnTableMetadata = {
            type: 'music',
            title: oembed.title ?? '',
            artist: '',
            cover: oembed.thumbnail_url ?? null,
            service: 'spotify',
            url,
        };
        return NextResponse.json(metadata);
    }

    return NextResponse.json({ error: 'Unsupported URL' }, { status: 400 });
}
