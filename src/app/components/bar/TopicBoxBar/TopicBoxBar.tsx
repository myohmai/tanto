import { BoxIcon } from "@/app/components/icons";
import { WhisperButton } from "@/app/components/buttons/WhisperButton";
import { TopicViewButton } from "@/app/components/buttons/TopicViewButton";

import './TopicBoxBar.scss';

type Props = {
    isInSalon: boolean;
    isHost: boolean;
    onWhisper?: () => void;
    onView?: () => void;
}

export const TopicBoxBar = ({ isInSalon,isHost, onWhisper, onView}: Props) => {
    return(
        <div className="topic-box-bar padding-sm-md bg-color-secondary text-color-primary">
            <div className="topic-box-bar__container inline-sm ">
                <BoxIcon size="md" className="icon-color-primary"/>
                <span>Topic Box</span>
            </div>
            {isInSalon ? (
                isHost ? <TopicViewButton onClick={onView!} /> : <WhisperButton onClick={onWhisper!} />
            ) : null}
        </div>
    )
}