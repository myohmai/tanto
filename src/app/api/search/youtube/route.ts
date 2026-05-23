import { NextRequest, NextResponse } from 'next/server';

export type YouTubeChannel = {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    description: string;
};

export async function POST(req: NextRequest) {
    const apiKey = process.env.YOUTUBE_API_KEY;

    if (!apiKey) {
        return NextResponse.json({ error: 'YouTube API key not configured' }, { status: 503 });
    }

    const { query } = await req.json();
    if (!query?.trim()) {
        return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    const url = new URL('https://www.googleapis.com/youtube/v3/search');
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'channel');
    url.searchParams.set('q', query);
    url.searchParams.set('maxResults', '8');
    url.searchParams.set('key', apiKey);

    const res = await fetch(url.toString());
    if (!res.ok) {
        return NextResponse.json({ error: 'YouTube search failed' }, { status: 502 });
    }

    const json = await res.json();
    const channels: YouTubeChannel[] = (json.items ?? []).map((item: any) => ({
        id: item.id.channelId,
        name: item.snippet.channelTitle,
        thumbnailUrl: item.snippet.thumbnails?.default?.url ?? null,
        description: item.snippet.description ?? '',
    }));

    return NextResponse.json({ channels });
}
