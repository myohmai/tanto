import { AddMediaContainer } from "@/app/components/container/AddMediaContainer";
import { Media } from "@/app/components/media/Media";
import { MediaLabelType } from "@/app/components/media/MediaLabel";
import { MediaEmbed } from "@/app/components/media/MediaEmbed";
import { SelectMediaLabel } from "@/app/components/menu/SelectMediaLabel";
import { MediaEmbedForm } from "@/app/components/menu/MediaEmbedForm";

import { MediaItem } from "@/app/types/media";
import { Topic } from "@/app/types/topic";

import { nanoid } from "nanoid";

import './TopicBox.scss'
import { useState, useRef } from "react";


type Props = {
    onSelectFile: (file: File[]) => void;
    onWhisper: (payload: Topic) => void;
    userId: string;
    salonId: string;
    roomId: string;
    lang: "en" | "ja";
}

export const TopicBox = ({
    onSelectFile,
    onWhisper,
    userId,
    salonId,
    roomId,
    lang
}: Props ) => {
    const [previews, setPreview] = useState<MediaItem[]>([]);
    const [mediaType, setMediaType] = useState<MediaLabelType | null>(null);
    const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [embedUrl, setEmbedUrl] = useState("")
    const [isEmbedOpen, setIsEmbedOpen] = useState(false)
    const [topicContent, setTopicContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const MAX_LENGTH = 280;

    const handleSelectFile = (files: File[]) => {
        const newItems: MediaItem[] = files.map((file) => ({
            type: file.type.startsWith("video") ? "video" : "image",
            url: URL.createObjectURL(file),
        }));

        setPreview((prev) => [...prev, ...newItems]);
        onSelectFile(files);

    };
    const handlePost = () => {
        if (topicContent.trim().length === 0) return;
        if (previews.length > 0 && !mediaType) {
            setIsLabelOpen(true);
            return;
        }
        const payload: Topic = {
            topicId: nanoid(),

            roomId,
            salonId,
            userId,

            topicContent,

            media: previews.length > 0 ? { source: previews, type: mediaType } : undefined,
            mediaEmbed: {
                url: embedUrl,
            },

            postedAt: new Date().toISOString(),
            
        };
        onWhisper(payload);
    };
    return(
        <div className="topic-box padding-md stack-lg bg-color-primary text-color-primary">
            <div className="topic-box__input-area-wrapper stack-sm">
                <div className="topic-box__title">What do you think about this topic ? </div>
                <div className="topic-box__info">This message is anonymous, but it may be quoted and made public.</div>
                <div className="topic-box__input-area padding-md">
                    <textarea
                        ref={textareaRef}
                        id="topic-content"
                        name="content"
                        placeholder="How are you doing?"
                        maxLength={MAX_LENGTH}
                        value={topicContent}
                        className="topic-box__text"
                        onChange={(e) => {
                            setTopicContent(e.target.value);

                            const el = textareaRef.current;
                            if (!el) return;

                            el.style.height = "auto";
                            el.style.height = el.scrollHeight + "px";
                        }}
                    />
                    {previews.length > 0 && (
                        <Media
                            source={previews}
                            type={mediaType}
                            lang={lang}
                            onRemove={(index) => {
                                setPreview((prev) => {
                                    const target = prev[index];
                                    if (target) {
                                    URL.revokeObjectURL(target.url);
                                    }
                                    return prev.filter((_, i) => i !== index);
                                });
                            }}
                        />
                    )}
                    {embedUrl && ( <MediaEmbed url={embedUrl} />)}
                    <div className="topic-box__count text-color-primary">
                        {topicContent.length} / {MAX_LENGTH}
                    </div>
                </div>
                <AddMediaContainer onSelectFile={handleSelectFile} onClick={() => setIsEmbedOpen(true)} />
            </div>
            <button
                type="button"
                onClick={handlePost}
                disabled={topicContent.trim().length === 0}
                className="topic-box__whisper padding-sm-md"
                >Whisper</button>
            <SelectMediaLabel
                isOpen={isLabelOpen}
                onClose={() => setIsLabelOpen(false)}
                onSubmit={(value) => {
                    setMediaType(value);
                    setIsLabelOpen(false);
                }}
            />
            <MediaEmbedForm
                isOpen={isEmbedOpen}
                onClose={() => setIsEmbedOpen(false)}
                onSubmit={(value) => {
                    setEmbedUrl(value);
                    setIsEmbedOpen(false);
                }}
            />
        </div>
    )
}