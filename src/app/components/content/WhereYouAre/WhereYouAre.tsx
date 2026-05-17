import { ArrowRightIcon } from '@/app/components/icons'
import './WhereYouAre.scss'

type Props = 
    {
        isInSalon: boolean;
        isInRoom: boolean;
        roomName: string;
        salonName?: string;
        onRoom: (e: React.MouseEvent<HTMLButtonElement>) => void;
        onSalon?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    };

export const WhereYouAre = ( { isInSalon, isInRoom, roomName, salonName, onRoom, onSalon }: Props ) => {
    return(
        <div className="where-you-are inline-xs">
                    {isInSalon && (
                        <button type='button' className="where-you-are__room text-color-primary" onClick={onRoom}>{roomName}</button>
                    )}
                    {!isInRoom && !isInSalon && (<>
                        <button type='button' className="where-you-are__room text-color-primary" onClick={onRoom}>{roomName}</button>
                        <ArrowRightIcon className="where-you-are__arrow icon-color-secondary" />
                        <button type='button' className="where-you-are__salon text-color-primary" onClick={onSalon}>{salonName}</button>
                    </>)}
                    {isInRoom && (<button type='button' className="where-you-are__salon text-color-primary" onClick={onSalon}>{salonName}</button>)}
                </div>
    )
}