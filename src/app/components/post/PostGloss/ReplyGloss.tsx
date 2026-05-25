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
import { useState, useRef } from "react";
import { useTranslations } from 'next-intl';


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
    salonId: string | undefined;
    userId: string | undefined;
    roomName: string;
    salonName?: string | undefined;
    userName: string;
    onRoom: () => void;
    onSalon?: () => void;
    onSelectFile: (file: File[]) => void;
    onUploadFile?: (file: File) => Promise<string>;
    onPost: (payload: GlossData) => void;
    topic?: Topic;
    lang: "en" | "ja";
}

const getReplyDraft = (): GlossData | null => {
    if (typeof window === "undefined") return null;

    const saved = localStorage.getItem("reply-draft");
    if (!saved) return null;

    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
};

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
    onUploadFile,
    onPost,
    topic,
    lang
}: Props) => {
    const t = useTranslations('gloss');
    const [draft] = useState<GlossData | null>(() => getReplyDraft());
    const [previews, setPreview] = useState<MediaItem[]>(
        () => draft?.media?.source ?? []
    );
    const [mediaType, setMediaType] = useState<MediaLabelType | null>(
        () => draft?.media?.type ?? null
    );
    const [isLabelOpen, setIsLabelOpen] = useState(false);
    const [embedUrl, setEmbedUrl] = useState(() => draft?.mediaEmbed?.url ?? "")
    const [isEmbedOpen, setIsEmbedOpen] = useState(false)
    const [content, setContent] = useState(() => draft?.content ?? "");
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const uploadPromises = useRef<Map<string, Promise<string>>>(new Map());
    const MAX_LENGTH = 280;

    const handleSelectFile = (files: File[]) => {
        const newItems: MediaItem[] = files.map((file) => {
            const blobUrl = URL.createObjectURL(file);
            if (onUploadFile) {
                uploadPromises.current.set(blobUrl, onUploadFile(file));
            }
            return {
                type: file.type.startsWith("video") ? "video" : "image",
                url: blobUrl,
            };
        });
        setPreview((prev) => [...prev, ...newItems]);
        onSelectFile(files);
    };

    const handlePost = async () => {
        if (content.trim().length === 0) return;
        if (previews.length > 0 && !mediaType) {
            setIsLabelOpen(true);
            return;
        }

        let resolvedPreviews = previews;
        if (onUploadFile && uploadPromises.current.size > 0) {
            resolvedPreviews = await Promise.all(
                previews.map(async (item) => {
                    const promise = uploadPromises.current.get(item.url);
                    return promise ? { ...item, url: await promise } : item;
                })
            );
        }

        const payload: GlossData = {
            glossId: nanoid(),

            roomId,
            salonId,
            userId,

            content,
            media: resolvedPreviews.length > 0 ? { source: resolvedPreviews, type: mediaType } : undefined,
            mediaEmbed: embedUrl ? { url: embedUrl } : undefined,
            reports: [],
            topic,
            postedAt: new Date().toISOString(),
            userName,
            salonName,
            roomName,

            replyCount: 0,
            fondCount: 0,
            replyToGlossId: replyTo.glossId,
        };
        onPost(payload);
        localStorage.removeItem("reply-draft");
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
            reports: [],
            topic,
            postedAt: new Date().toISOString(),
            userName,
            salonName,
            roomName,

            replyCount:0,
            fondCount: 0,
            replyToGlossId: replyTo.glossId,
        };

        localStorage.setItem("reply-draft", JSON.stringify(draft));
    };

    return (
        <div className="post-gloss bg-color-primary">
            <PostMenuBar
                type="reply"
                onCancel={() => {
                    localStorage.removeItem("reply-draft");
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
                            placeholder={t('placeholder')}
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
                                            uploadPromises.current.delete(target.url);
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
