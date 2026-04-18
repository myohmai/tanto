import { GlossCancelButton } from "@/app/components/buttons/GlossCancelButton";
import { GlossDraftButton } from "@/app/components/buttons/GlossDraftButton";

import './PostMenuBar.scss'

type Props = {
    type: 'new' | 'reply';
    onCancel: () => void;
    onDraft: () => void;
}

export const PostMenuBar = ({ type, onCancel, onDraft }: Props) => {
    const isNew = type == 'new';
    return (
        <div className="post-menu-bar padding-sm-lg text-color-primary bg-color-primary">
            <GlossCancelButton onClick={onCancel} />
            <span> {isNew ? 'New Gloss' : 'Reply Gloss'}</span>
            <GlossDraftButton onClick={onDraft} />
        </div>
    )
}