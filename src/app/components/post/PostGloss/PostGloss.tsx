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
    onCancel: () => void;
    iconUrl?: string | null;
    subIcon? : UserSubIcon | null;
    roomId: string;
    salonId: string;
    userId: string;
    roomName: string;
    salonName?: string;
    userName: string | null | undefined;
    onRoom: () => void;
    onSalon?: () => void;
    onSelectFile: (file: File[]) => void;
    onUploadFile?: (file: File) => Promise<string>;
    onPost: (payload: GlossData) => void;
    topic?: Topic;
    lang: "en" | "ja";
    isAdmin?: boolean;
}

const getPostDraft = (): GlossData | null => {
    if (typeof window === "undefined") return null;

    const saved = localStorage.getItem("post-draft");
    if (!saved) return null;

    try {
        return JSON.parse(saved);
    } catch {
        return null;
    }
};

export const PostGloss = ({
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
    lang,
    isAdmin
}: Props) => {
    const t = useTranslations('gloss');
    const [draft] = useState<GlossData | null>(() => getPostDraft());
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
    const [downloadUrl, setDownloadUrl] = useState(() => draft?.downloadUrl ?? "");
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
            downloadUrl: downloadUrl || undefined,
            reports: [],
            topic,
            postedAt: new Date().toISOString(),
            userName,
            salonName,
            roomName,

            replyCount: 0,
            fondCount: 0,
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
            downloadUrl: downloadUrl || undefined,
            reports: [],
            topic,
            postedAt: new Date().toISOString(),
            userName,
            salonName,
            roomName,

            replyCount:0,
            fondCount: 0,
        };

        localStorage.setItem("post-draft", JSON.stringify(draft));
    };

    return (
        <div className="post-gloss bg-color-primary">
            <PostMenuBar
                type="new"
                onCancel={() => {
                    localStorage.removeItem("post-draft");
                    onCancel();
                }}
                onDraft={handleDraft}
            />
            <div className="post-gloss__wrapper">
                <UserCustomIcon iconUrl={iconUrl} subIcon={subIcon} />
                <div className="post-gloss__container">
                    <WhereYouAre isInSalon={false} isInRoom={false} onRoom={onRoom} onSalon={onSalon} roomName={roomName} salonName={salonName} />
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
                    {isAdmin && (
                        <input
                            type="url"
                            placeholder="ダウンロードURL（任意）"
                            value={downloadUrl}
                            onChange={(e) => setDownloadUrl(e.target.value)}
                            className="post-gloss__download-url"
                        />
                    )}
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
