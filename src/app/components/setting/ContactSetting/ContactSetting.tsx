'use client';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SettingTopBar } from '@/app/components/setting/SettingTopBar';
import { SubmitButton } from '@/app/components/buttons/SubmitButton';
import { ExclamationIcon } from '@/app/components/icons';
import { submitContact } from '@/repositories/contact';
import type { ContactType } from '@/app/types/contact';

import './ContactSetting.scss';

type Props = {
    onBack: () => void;
};

export const ContactSetting = ({ onBack }: Props) => {
    const t = useTranslations('contact');
    const tCommon = useTranslations('common');

    const [type, setType] = useState<ContactType>('bug');
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState('');

    const types: { value: ContactType; label: string }[] = [
        { value: 'bug', label: t('typeBug') },
        { value: 'deletion', label: t('typeDeletion') },
        { value: 'open_room', label: t('typeOpenRoom') },
    ];

    const handleSubmit = async () => {
        if (!title.trim() || !body.trim()) return;
        setSending(true);
        setError('');
        try {
            await submitContact(type, title.trim(), body.trim());
            setSent(true);
            setTitle('');
            setBody('');
        } catch {
            setError(t('errorMessage'));
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="contact-setting bg-color-primary">
            <SettingTopBar
                title={t('title')}
                icon={<ExclamationIcon className="icon-color-primary" />}
                onBack={onBack}
            />

            {sent ? (
                <div className="contact-setting__sent stack-md">
                    <p className="contact-setting__sent-message text-color-primary">{t('sentMessage')}</p>
                    <SubmitButton label={t('backToSetting')} onClick={onBack} />
                </div>
            ) : (
                <div className="contact-setting__form stack-md">
                    <div className="contact-setting__type-group">
                        <p className="contact-setting__label text-color-secondary">{t('typeLabel')}</p>
                        <div className="contact-setting__types">
                            {types.map(({ value, label }) => (
                                <button
                                    key={value}
                                    type="button"
                                    className={`contact-setting__type-btn ${type === value ? 'active' : ''}`}
                                    onClick={() => setType(value)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="contact-setting__field">
                        <label className="contact-setting__label text-color-secondary">{t('titleLabel')}</label>
                        <input
                            className="contact-setting__input bg-color-secondary text-color-primary"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('titlePlaceholder')}
                            maxLength={100}
                        />
                    </div>

                    <div className="contact-setting__field">
                        <label className="contact-setting__label text-color-secondary">{t('bodyLabel')}</label>
                        <textarea
                            className="contact-setting__textarea bg-color-secondary text-color-primary"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder={t('bodyPlaceholder')}
                            maxLength={1000}
                            rows={6}
                        />
                        <span className="contact-setting__count text-color-secondary">{body.length} / 1000</span>
                    </div>

                    {error && <p className="contact-setting__error">{error}</p>}

                    <SubmitButton
                        label={sending ? tCommon('sending') : tCommon('send')}
                        onClick={handleSubmit}
                        disabled={sending || !title.trim() || !body.trim()}
                    />
                </div>
            )}
        </div>
    );
};
