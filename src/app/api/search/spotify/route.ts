import { NextRequest, NextResponse } from 'next/server';

export type SpotifyArtist = {
    id: string;
    name: string;
    thumbnailUrl: string | null;
    followers: number;
    genres: string[];
};

export async function POST(req: NextRequest) {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        return NextResponse.json({ error: 'Spotify API keys not configured' }, { status: 503 });
    }

    const { query } = await req.json();
    if (!query?.trim()) {
        return NextResponse.json({ error: 'query is required' }, { status: 400 });
    }

    // Client Credentials でアクセストークン取得
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
        },
        body: 'grant_type=client_credentials',
    });

    if (!tokenRes.ok) {
        const body = await tokenRes.json().catch(() => ({}));
        console.error('Spotify token error:', tokenRes.status, body);
        return NextResponse.json({ error: 'Failed to get Spotify token. Check SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.', detail: body }, { status: 502 });
    }

    const { access_token } = await tokenRes.json();

    const market = process.env.SPOTIFY_MARKET ?? 'JP';
    const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=artist&limit=8&market=${market}`,
        { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!searchRes.ok) {
        const body = await searchRes.json().catch(() => ({}));
        console.error('Spotify search error:', searchRes.status, body);
        return NextResponse.json({ error: `Spotify search failed (${searchRes.status})`, detail: body }, { status: 502 });
    }

    const json = await searchRes.json();
    const artists: SpotifyArtist[] = (json.artists?.items ?? []).map((a: any) => ({
        id: a.id,
        name: a.name,
        thumbnailUrl: a.images?.[0]?.url ?? null,
        followers: a.followers?.total ?? 0,
        genres: a.genres ?? [],
    }));

    return NextResponse.json({ artists });
}
