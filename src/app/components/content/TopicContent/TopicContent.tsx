import { QuotationIcon } from "@/app/components/icons";
import { Media, MediaItem, MediaProps } from "@/app/components/media/Media";
import { MediaLabelType, Lang } from "@/app/components/media/MediaLabel";
import { MediaEmbed } from "@/app/components/media/MediaEmbed";

import './TopicContent.scss'

export type TopicProps = {
    topicContent: string;
    source?: MediaItem[];
    type?: MediaLabelType;
    lang?: Lang;
    url?: string;
    onClick?: () => void;
}

export const TopicContent = ({ topicContent, source, type, lang, url, onClick }: TopicProps ) => {
    const getDisplayUrl = (url: string) => {
        try {
            const hostname = new URL(url).hostname.replace(/^www\./, "");
            return hostname;
        } catch {
            return url;
        }
        };

        const renderTextWithLinks = (text: string) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;

        return text.split(urlRegex).map((part, i) => {
            if (part.match(/^https?:\/\/[^\s]+$/)) {
            return (
                <a
                key={i}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                >
                {getDisplayUrl(part)}
                </a>
            );
            }

            return <span key={i}>{part}</span>;
        });
    };
    return(
        <div className="topic-content bg-color-secondary padding-md stack-sm">
            <QuotationIcon className="icon-color-secondary" />
            <div className="topic-content__text text-color-primary">
                {renderTextWithLinks(topicContent)}
            </div>
            {source && source.length > 0 && (<Media source={source} type={type!} lang={lang!}/>) }
            {url && (<MediaEmbed url={url} onClick={onClick} />)}
        </div>
    )
}