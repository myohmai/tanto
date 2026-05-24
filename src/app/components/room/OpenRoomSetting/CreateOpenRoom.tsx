"use client";
import { useState, useRef, useEffect } from 'react';
import { EntitySearch, type EntityCandidate } from '@/app/components/search/EntitySearch';
import { EditRoomBannerPicture } from '@/app/components/form/EditRoomBannerPicture';
import { RoomCustomIcon } from '@/app/components/custom-icon/RoomCustomIcon';
import { EditIconButton } from '@/app/components/buttons/EditIconButton';
import { SubmitButton } from '@/app/components/buttons/SubmitButton';
import type { RoomData } from '@/app/types/room';
import type { Entity } from '@/app/types/entity';
import './OpenRoomSetting.scss';

type Props = {
    onCreateOpenRoom: (room: RoomData, entity: Entity) => Promise<void>;
};

export const CreateOpenRoom = ({ onCreateOpenRoom }: Props) => {
    const roomId = useRef(crypto.randomUUID()).current;
    const entityId = useRef(crypto.randomUUID()).current;

    const [candidate, setCandidate] = useState<EntityCandidate | null>(null);
    const [roomIconUrl, setRoomIconUrl] = useState<string | null>(null);
    const [roomBannerUrl, setRoomBannerUrl] = useState<string | null>(null);
    const [roomName, setRoomName] = useState('');
    const [roomInfo, setRoomInfo] = useState('');
    const [roomRule, setRoomRule] = useState('');
    const [fanName, setFanName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const infoRef = useRef<HTMLTextAreaElement>(null);
    const ruleRef = useRef<HTMLTextAreaElement>(null);

    const INFO_MAX = 280;
    const RULE_MAX = 1000;

    // Entity選択時: 未編集の項目だけ自動セット
    const handleSelectCandidate = (c: EntityCandidate) => {
        setCandidate(c);
        if (!roomName) setRoomName(c.label);
        if (!roomInfo) setRoomInfo(`${c.label}のOpen Roomです。`);
        // アイコンは未カスタムなら entity thumbnail で上書き
        if (!roomIconUrl || roomIconUrl === candidate?.thumbnailUrl) {
            setRoomIconUrl(c.thumbnailUrl ?? null);
        }
    };

    // candidate が変わったとき icon も追従（初回選択のみ）
    useEffect(() => {
        if (candidate && !roomIconUrl) {
            setRoomIconUrl(candidate.thumbnailUrl ?? null);
        }
    }, [candidate]);

    const handleSubmit = async () => {
        setIsSubmitted(true);
        if (!candidate || !roomName.trim() || !roomInfo.trim()) return;

        setSubmitting(true);
        try {
            const entity: Entity = {
                entityId,
                label:           candidate.label,
                entityType:      'external',
                externalService: candidate.externalService,
                externalId:      candidate.externalId,
                thumbnailUrl:    candidate.thumbnailUrl ?? undefined,
            };

            const room: RoomData = {
                roomId,
                roomIconUrl,
                roomBannerUrl,
                roomName,
                roomInformation:  roomInfo,
                tags:             [],
                roomRule,
                roomMemberIni:    { iconUrl: null, initialName: fanName.trim() || null },
                roomMemberCount:  0,
                roomVisibility:   'public',
                roomEntrySetting: undefined,
                roomKeyWord:      undefined,
                roomKeyWordHint:  undefined,
                roomQuiz:         null,
                roomQuizScore:    undefined,
                roomHost:         undefined,
                hostCreateSalon:  true,
                entityIds:        [entityId],
                isOpenRoom:       true,
                reports:          [],
                glossCount:       0,
                recentGlossCount: 0,
            };

            await onCreateOpenRoom(room, entity);
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

                <div>
                    <div className="open-room-setting__section-label">アーティスト / チャンネルを検索</div>
                    {candidate ? (
                        <div className="open-room-setting__selected-entity">
                            {candidate.thumbnailUrl
                                ? <img className="open-room-setting__entity-thumb" src={candidate.thumbnailUrl} alt={candidate.label} />
                                : <div className="open-room-setting__entity-thumb-placeholder" />
                            }
                            <div className="open-room-setting__entity-info">
                                <div className="open-room-setting__entity-name">{candidate.label}</div>
                                <div className="open-room-setting__entity-service">{candidate.externalService} · {candidate.externalId}</div>
                            </div>
                            <button
                                type="button"
                                className="open-room-setting__clear-btn"
                                onClick={() => setCandidate(null)}
                            >
                                変更
                            </button>
                        </div>
                    ) : (
                        <EntitySearch onSelect={handleSelectCandidate} />
                    )}
                    {isSubmitted && !candidate && (
                        <div className="input-box__error">アーティストを選択してください</div>
                    )}
                </div>

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
                        <div className="input-box__label">ファンネーム（メンバーのデフォルト名）</div>
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
                    label={submitting ? '作成中...' : 'OpenRoom を作成'}
                    onClick={handleSubmit}
                />
            </div>
        </div>
    );
};
