import { AddMediaContainer } from '@/app/components/container/AddMediaContainer';
import { PostButton } from '@/app/components/buttons/PostButton';

import './PostMediaBar.scss'

type Props = {
    onSelectFile: (file: File[]) => void;
    onMedia: () => void;
    onPost: () => void;
    disabled?: boolean;
}

export const PostMediaBar = ({ onSelectFile, onMedia, onPost, disabled }: Props ) => {
    return(
        <div className='post-media-bar bg-color-primary padding-sm-lg '>
            <AddMediaContainer onSelectFile={onSelectFile} onClick={onMedia} />
            <PostButton onClick={onPost} disabled={disabled}/>
        </div>
    )
}