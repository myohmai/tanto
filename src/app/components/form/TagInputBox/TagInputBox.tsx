"use client";
import { TagInputChip } from "@/app/components/tag/TagInputChip";
import { useTranslations } from 'next-intl';

import { useState } from "react";

import './TagInputBox.scss'

type Props = {
    onChange?: (tags: string[]) => void
}

export const TagInputBox = ({ onChange }: Props ) => {
    const t = useTranslations('room');
    const [tags, setTags] = useState<string[]>([]);
    const [inputValue, setInputValue] = useState("");
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Add tag (Space / Enter)
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();

            const newTag = inputValue.trim();

            if (newTag !== "" && !tags.includes(newTag)) {
                const newTags = [...tags, newTag];
                setTags(newTags);
                onChange?.(newTags);
                setInputValue("");
                e.currentTarget.value = "";
            }
        }

        // Delete last tag when input is empty
        if (e.key === "Backspace" && inputValue === "") {
            const newTags = tags.slice(0, -1);
            setTags(newTags);
            onChange?.(newTags);
        }
    };

    const deleteTag = (index: number) => {
        const newTags = tags.filter((_, i) => i !== index);
        setTags(newTags);
        onChange?.(newTags);
    };
    return (
        <div className="input-box__container bg-color-primary">
            <div className="input-box__label">{t('roomTag')}</div>
            <div className="tag-input-box">
                {tags.map((tag, index) => (
                    <TagInputChip
                        key={index}
                        label={tag}
                        onRemove={() => deleteTag(index)}
                    />
                    ))}

                <input
                className="tag-input-box__text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('tagPlaceholder')}
                />
            </div>
        </div>
    )
}