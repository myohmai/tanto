import { PostMenuBar } from "@/app/components/bar/PostMenuBar";
import { UserCustomIcon, UserSubIcon } from "@/app/components/custom-icon/UserCustomIcon";
import { WhereYouAre } from "@/app/components/content/WhereYouAre";
import { TopicContent } from "@/app/components/content/TopicContent";
import { PostMediaBar } from "@/app/components/bar/PostMediaBar";
import { Media, MediaItem } from "@/app/components/media/Media";
import { MediaLabelType } from "@/app/components/media/MediaLabel";
import { MediaEmbed } from "@/app/components/media/MediaEmbed";
import { SelectMediaLabel } from "@/app/components/menu/SelectMediaLabel";
import { MediaEmbedForm } from "@/app/components/menu/MediaEmbedForm";
import { GlossData } from "@/app/types/gloss";
import { Topic } from "@/app/types/topic";

import { nanoid } from "nanoid";

import './PostGloss.scss'
import { useState, useEffect, useRef } from "react";


type Props = {
    replyTo: {
        glossId: string;
        glossContent: string;
        iconUrl?: string;
        subIcon?:  UserSubIcon | null;
        userName: string;
    }
    onCancel: () => void;
    iconUrl?: string;
    subIcon? : UserSubIcon | null;
    roomId: string;
    salonId: string;
    userId: string;
    roomName: string;
    salonName?: string;
    userName: string;
    onRoom: () => void;
    onSalon?: () => void;
    onSelectFile: (file: File[]) => void;
    onPost: (payload: GlossData) => void;
    topic?: Topic;
    lang: "en" | "ja";
}

export const ReplyGloss = ({
    replyTo,
    onCancel,
    iconUrl,
    subIcon,
    roomId,
    salonId,
    userId,
    roomName,
    salonName,
    userName,
    onRoom,
    onSalon,
    onSelectFile,
    onPost,
    topic,
    lang
}: Props) => {
    const [previews, setPreview] = useState<MediaItem[]>([]);
    const [mediaType, setMediaType] = useState<MediaLabelType | null>(null);
    const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [embedUrl, setEmbedUrl] = useState("")
    const [isEmbedOpen, setIsEmbedOpen] = useState(false)
    const [content, setContent] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const MAX_LENGTH = 280;

    useEffect(() => {
        const saved = localStorage.getItem("post-draft");
        if (!saved) return;

        const draft: GlossData = JSON.parse(saved);

        setContent(draft.content);
        setPreview(draft.media?.source ?? []);
        setMediaType(draft.media?.type ?? null);
        setEmbedUrl(draft.mediaEmbed?.url ?? "");
    }, []);

    const handleSelectFile = (files: File[]) => {
        const newItems: MediaItem[] = files.map((file) => ({
            type: file.type.startsWith("video") ? "video" : "image",
            url: URL.createObjectURL(file),
        }));

        setPreview((prev) => [...prev, ...newItems]);
        onSelectFile(files);

    };

    const handlePost = () => {
        if (content.trim().length === 0) return;
        if (previews.length > 0 && !mediaType) {
            setIsLabelOpen(true);
            return;
        }
        const payload: GlossData = {
            glossId: nanoid(),

            roomId,
            salonId,
            userId,
            
            content,
            media: previews.length > 0 ? { source: previews, type: mediaType } : undefined,
            mediaEmbed: embedUrl ? { url: embedUrl } : undefined,
            topic,
            postedAt: new Date().toISOString(),
            userName,
            salonName,
            roomName,

            replyCount:0,
            fondCount: 0,
            replyToGlossId: replyTo.glossId,
        };
        onPost(payload);
        localStorage.removeItem("post-draft");
    };

    const handleDraft = () => {
        const draft: GlossData = {
            glossId: nanoid(),

            roomId,
            salonId,
            userId,
            
            content,
            media: previews.length > 0 ? { source: previews, type: mediaType } : undefined,
            mediaEmbed: embedUrl ? { url: embedUrl } : undefined,
            topic,
            postedAt: new Date().toISOString(),
            userName,
            salonName,
            roomName,

            replyCount:0,
            fondCount: 0,
            replyToGlossId: replyTo.glossId,
        };

        localStorage.setItem("post-draft", JSON.stringify(draft));
    };

    return (
        <div className="post-gloss bg-color-primary">
            <PostMenuBar
                type="reply"
                onCancel={() => {
                    localStorage.removeItem("post-draft");
                    onCancel();
                }}
                onDraft={handleDraft}
            />
            <div className="reply-gloss">
                <div className="reply-gloss__wrapper padding-md">
                    <UserCustomIcon iconUrl={replyTo.iconUrl} subIcon={replyTo.subIcon} className="reply-gloss__icon"/>
                    <div className="reply-gloss__container">
                        <div className="reply-gloss__name-container">
                            <WhereYouAre isInSalon={false} isInRoom={false} onRoom={onRoom} onSalon={onSalon} roomName={roomName} salonName={salonName} />
                            <div className="reply-gloss__name text-color-primary">
                                {replyTo.userName}
                            </div>
                        </div>
                        <div className="reply-gloss__content text-color-primary">
                            {replyTo.glossContent}
                        </div>
                    </div>
                </div>
                <div className="post-gloss__wrapper">
                    <UserCustomIcon iconUrl={iconUrl} subIcon={subIcon} />
                    <div className="post-gloss__container">
                        
                        <textarea
                            ref={textareaRef}
                            id="post-content"
                            name="content"
                            placeholder="How are you doing?"
                            maxLength={MAX_LENGTH}
                            value={content}
                            className="post-gloss__text"
                            onChange={(e) => {
                                setContent(e.target.value);

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
                        {topic?.topicContent && (<TopicContent topic={topic} lang={lang}/>)} 
                    </div>
                </div>
            </div>
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
                <PostMediaBar
                    onSelectFile={handleSelectFile}
                    onMedia={() => setIsEmbedOpen(true)}
                    onPost={handlePost}
                    disabled={content.trim().length === 0}
                />
                <div className="post-gloss__count text-color-primary">
                    {content.length} / {MAX_LENGTH}
                </div>
        </div>
    )
}