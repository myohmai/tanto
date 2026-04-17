import { ArrowRightIcon } from "@/app/components/icons";

import './SeeAlso.scss'

type Props = {
    onClick: () => void;
}

export const SeeAlso = ({ onClick }: Props) => {
    return (
        <button type="button" onClick={onClick} className="see-also inline-xs text-color-secondary">
            <span>See Also</span>
            <ArrowRightIcon className="see-also__icon icon-color-secondary" />
        </button>
    )
}