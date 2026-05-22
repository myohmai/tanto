import './OnboardRoomCard.scss';
import { RoomEnterButton } from '@/app/components/buttons/RoomEnterButton';
import { RoomCustomIcon, roomSubIcon } from '../../custom-icon/RoomCustomIcon';

type Props = {
    roomName: string;
    iconUrl?: string | null;
    subIcon?: roomSubIcon | null;
    bannerUrl?: string | null;
    joined: boolean;
    onToggle: () => void;
};

export const OnboardRoomCard = ({ roomName, iconUrl, subIcon, bannerUrl, joined, onToggle }: Props) => {
    return (
        <div className="onboard-room-card bg-color-primary text-color-primary">
            <div className="onboard-room-card__banner">
                {bannerUrl
                    ? <img src={bannerUrl} alt="" className="onboard-room-card__banner-img" />
                    : <div className="onboard-room-card__banner-placeholder" />
                }
                <div className="onboard-room-card__icon">
                    {iconUrl
                        ? <RoomCustomIcon roomIconUrl={iconUrl} subIcon={subIcon} className="onboard-room-card__icon-img" />
                        : <div className="onboard-room-card__icon-placeholder" />
                    }
                </div>
            </div>
            <div className="onboard-room-card__body">
                <span className="onboard-room-card__name">{roomName}</span>
                <RoomEnterButton isEntered={joined} onClick={onToggle} isInRoom={true} className='onboard-room-card__btn' />
            </div>
        </div>
    );
};
