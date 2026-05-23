"use client";
import { useState, useRef } from 'react';
import { EditRoomBannerPicture } from '@/app/components/form/EditRoomBannerPicture';
import { RoomCustomIcon } from '@/app/components/custom-icon/RoomCustomIcon';
import { EditIconButton } from '@/app/components/buttons/EditIconButton';
import { SubmitButton } from '@/app/components/buttons/SubmitButton';
import type { RoomData } from '@/app/types/room';
import type { Entity } from '@/app/types/entity';
import './OpenRoomSetting.scss';

type Props = {
    roomData: RoomData;
    entity: Entity | null;
    onSave: (room: RoomData) => Promise<void>;
    onDelete: () => Promise<void>;
};

export const EditOpenRoom = ({ roomData, entity, onSave, onDelete }: Props) => {
    const [roomName, setRoomName] = useState(roomData.roomName);
    const [roomInfo, setRoomInfo] = useState(roomData.roomInformation);
    const [roomRule, setRoomRule] = useState(roomData.roomRule);
    const [fanName, setFanName] = useState(roomData.roomMemberIni?.initialName ?? '');
    const [roomIconUrl, setRoomIconUrl] = useState<string | null>(roomData.roomIconUrl ?? null);
    const [roomBannerUrl, setRoomBannerUrl] = useState<string | null>(roomData.roomBannerUrl ?? null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const infoRef = useRef<HTMLTextAreaElement>(null);
    const ruleRef = useRef<HTMLTextAreaElement>(null);

    const INFO_MAX = 280;
    const RULE_MAX = 1000;

    const handleSave = async () => {
        setIsSubmitted(true);
        if (!roomName.trim() || !roomInfo.trim()) return;

        setSubmitting(true);
        try {
            await onSave({
                ...roomData,
                roomName,
                roomInformation: roomInfo,
                roomRule,
                roomMemberIni: { iconUrl: roomData.roomMemberIni?.iconUrl ?? null, initialName: fanName.trim() || null },
                roomIconUrl,
                roomBannerUrl,
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="open-room-setting bg-color-primary text-color-primary">
            <EditRoomBannerPicture
                onChangeBanner={file => setRoomBannerUrl(URL.createObjectURL(file))}
                bannerImageUrl={roomBannerUrl}
            />

            <div className="open-room-setting__wrapper stack-lg">
                <div className="open-room-setting__icon-row">
                    <RoomCustomIcon roomIconUrl={roomIconUrl} className="open-room-setting__room-icon" />
                    <EditIconButton
                        onSelectFile={file => setRoomIconUrl(URL.createObjectURL(file))}
                    />
                </div>

                {entity && (
                    <div className="open-room-setting__selected-entity">
                        {entity.thumbnailUrl
                            ? <img className="open-room-setting__entity-thumb" src={entity.thumbnailUrl} alt={entity.label} />
                            : <div className="open-room-setting__entity-thumb-placeholder" />
                        }
                        <div className="open-room-setting__entity-info">
                            <div className="open-room-setting__entity-name">{entity.label}</div>
                            <div className="open-room-setting__entity-service">
                                {entity.externalService} · {entity.externalId}
                            </div>
                        </div>
                    </div>
                )}

                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">Room名</div>
                        <input
                            type="text"
                            className="input-box__text-box"
                            value={roomName}
                            maxLength={30}
                            onChange={e => setRoomName(e.target.value)}
                        />
                    </div>
                    {isSubmitted && !roomName.trim() && (
                        <div className="input-box__error">必須項目です</div>
                    )}
                </div>

                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">ファンネーム</div>
                        <input
                            type="text"
                            className="input-box__text-box"
                            placeholder={roomName ? `${roomName} Fan` : 'Fan'}
                            value={fanName}
                            maxLength={30}
                            onChange={e => setFanName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">Room説明</div>
                        <textarea
                            className="input-box__text-area"
                            value={roomInfo}
                            maxLength={INFO_MAX}
                            ref={infoRef}
                            onChange={e => {
                                setRoomInfo(e.target.value);
                                const el = infoRef.current;
                                if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
                            }}
                        />
                        <div className="room-setting__info-count text-color-secondary">
                            {roomInfo.length} / {INFO_MAX}
                        </div>
                    </div>
                    {isSubmitted && !roomInfo.trim() && (
                        <div className="input-box__error">必須項目です</div>
                    )}
                </div>

                <div className="input-box">
                    <div className="input-box__container">
                        <div className="input-box__label">ルール（任意）</div>
                        <textarea
                            className="input-box__text-area"
                            value={roomRule}
                            maxLength={RULE_MAX}
                            ref={ruleRef}
                            onChange={e => {
                                setRoomRule(e.target.value);
                                const el = ruleRef.current;
                                if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
                            }}
                        />
                        <div className="room-setting__info-count text-color-secondary">
                            {roomRule.length} / {RULE_MAX}
                        </div>
                    </div>
                </div>

                <SubmitButton
                    label={submitting ? '保存中...' : '保存'}
                    onClick={handleSave}
                />

                <div className="open-room-setting__delete-area">
                    {confirmDelete ? (
                        <div className="open-room-setting__confirm-row">
                            <span className="text-color-secondary">本当に削除しますか？</span>
                            <button type="button" className="open-room-setting__delete-confirm-btn" onClick={onDelete}>
                                削除する
                            </button>
                            <button type="button" className="open-room-setting__cancel-btn" onClick={() => setConfirmDelete(false)}>
                                キャンセル
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="open-room-setting__delete-btn" onClick={() => setConfirmDelete(true)}>
                            OpenRoom を削除
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
