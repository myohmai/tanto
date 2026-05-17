import { QuotationIcon } from "@/app/components/icons";
import { Media } from "@/app/components/media/Media";
import { Lang } from "@/app/components/media/MediaLabel";
import { MediaEmbed } from "@/app/components/media/MediaEmbed";

import { Topic } from "@/app/types";

import './TopicContent.scss'

type Props = {
    topic: Topic;
    lang?: Lang;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const TopicContent = ({ topic, lang, onClick }: Props ) => {
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
                {renderTextWithLinks(topic.topicContent)}
            </div>
            {topic.media?.source && topic.media.source.length > 0 && (<Media source={topic.media.source} type={topic.media.type} lang={lang!}/>) }
            {topic.mediaEmbed && (<MediaEmbed url={topic.mediaEmbed.url} onClick={onClick} />)}
        </div>
    )
}