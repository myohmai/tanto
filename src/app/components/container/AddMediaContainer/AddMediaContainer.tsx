import { PictureButton } from '@/app/components/buttons/PictureButton';
import { CameraButton } from '@/app/components/buttons/CameraButton';
import { MediaButton } from '@/app/components/buttons/MediaButton';

import './AddMediaContainer.scss'

type Props = {
    onSelectFile: (file: File) => void;
    onClick: () => void;
}

export const AddMediaContainer = ({ onSelectFile, onClick }: Props) => {
    return(
        <div className='add-media-container inline-md' >
            <PictureButton onSelectFile={onSelectFile} />
            <CameraButton onSelectFile={onSelectFile} />
            <MediaButton onClick={onClick} />
        </div>
    );
}