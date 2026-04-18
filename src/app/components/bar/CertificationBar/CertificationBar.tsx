import { CheckIcon } from '@/app/components/icons'

import './CertificationBar.scss'

type Props = {
    onClick: () => void;
}

export const CertificationBar = ({ onClick }: Props) => {
    return(
        <button type='button' className='certification-bar inline-sm padding-sm-md bg-color-secondary text-color-primary' onClick={onClick}>
            <CheckIcon size='md' className='icon-color-primary' />
            <span>Certification</span>
        </button>
    )
}