import { ArrowRightIcon } from '@/app/components/icons'
import './WhereYouAre.scss'

type Props = 
    | {
        isInSalon: false;
        roomName: string;
        onRoom: () => void;
    }
    | {
        isInSalon: true;
        roomName: string;
        salonName: string;
        onRoom: ()=> void;
        onSalon: () => void;
    };

export const WhereYouAre = ( props: Props ) => {
    const { isInSalon, roomName,  onRoom} = props;
    return(
        <div className="where-you-are inline-xs">
                    <button type='button' className="where-you-are__room text-color-primary" onClick={onRoom}>{roomName}</button>
                    {isInSalon ? <ArrowRightIcon className="where-you-are__arrow icon-color-secondary" /> : ""}
                    {isInSalon ? <button type='button' className="where-you-are__salon text-color-primary" onClick={props.onSalon}>{props.salonName}</button> : ""}
                </div>
    )
}