import { Location, LocationItem } from '@/app/components/media/Location'
import { SeeAlso } from '@/app/components/media/SeeAlso'

import './MediaEmbed.scss'

type Props = {
    url: string;
    onClick: () => void;
}


export const MediaEmbed = ({ url, onClick }: Props) => {

    const sources = (url: string): LocationItem[] => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            return [{ type: 'youtube', url }];
        }
        if (url.includes('spotify.com')) {
            return [{ type: 'spotify', url }];
        }
        if (url.includes('music.apple.com')) {
            return [{ type: 'appleMusic', url }];
        }
        return [{ type: 'other', url }];
    }

    const extractYoutubeId = (url: string) => {
        try {
            if (url.includes('youtu.be')) {
                return url.split('youtu.be/')[1]?.split('?')[0];
            }
            const params = new URL(url).searchParams;
            return params.get('v');
        } catch {
            return null;
        }
    }

    const getEmbedUrl = (item: LocationItem) => {
        switch (item.type) {
            case 'youtube': {
                const id = extractYoutubeId(item.url);
                return id ? `https://www.youtube.com/embed/${id}` : null;
            }
            case 'spotify':
                return item.url.replace('/track/', '/embed/track/')
                                .replace('/album/', '/embed/album/')
                                .replace('/playlist/', '/embed/playlist/');
            case 'appleMusic':
                return item.url.replace('music.apple.com', 'embed.music.apple.com');
            case 'other':
                return item.url;
        }
    }
    
    const getHeight = (item: LocationItem) => {
        switch (item.type) {
            case 'youtube': return 380;
            case 'spotify' : return 152;
            case 'appleMusic' : return 175;
            default: return 380;
        }
    }

    const sourceList = sources(url);
    const displaySources = sourceList.filter(s => s.type !== 'other');
    const primary = sourceList[0];
    const embedUrl = primary ? getEmbedUrl(primary) : null;
    const hasLocation = displaySources.length > 0;

    return (
        <div className="media-embed stack-sm">
            {embedUrl && (
                <iframe
                    src={embedUrl}
                    width="100%"
                    height={primary ? getHeight(primary) : 380}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                />
            )}

            {hasLocation && <Location sources={displaySources} /> }
            {hasLocation && <div className='media-embed__seealso'><SeeAlso onClick={onClick} /></div>}
        </div>
    );
}