'use client';

import { QuestionIcon, CheckIcon, CancelIcon } from '@/app/components/icons';
import './Revaluation.scss';
type Lang = 'en' | 'ja';

const revaluationMessage: Record<Lang, { message: string; yes: string; no: string }> = {
    en: {
        message: 'Is this assessment appropriate?',
            yes: 'Yes',
            no: 'No',
    },
    ja: {
        message: 'この評価は適切ですか?',
            yes: 'はい',
            no: 'いいえ',
    }
}

type Props = {
    lang: 'en' | 'ja';
    onYes: () => void;
    onNo: () => void;  
}

export const Revaluation = ({ lang, onYes, onNo }: Props) => {
    const message = revaluationMessage[lang];

    return (
        <div className='revaluation stack-sm'>
            <div className='revaluation__message text-color-secondary inline-sm'>
                <QuestionIcon size="sm" className='icon-color-secondary' />
                <span>{message.message}</span>
            </div>
            <div className='revaluation__buttons inline-md'>
                <button type="button" onClick={onYes} className='revaluation__buttons--yes padding-xs-lg'>
                    <CheckIcon className='revaluation__buttons--yes-icon' />
                    <span>{message.yes}</span>
                </button>
                <button type="button" onClick={onNo} className='revaluation__buttons--no padding-xs-lg'>
                    <CancelIcon className='revaluation__buttons--no-icon' />
                    <span>{message.no}</span>
                </button>
            </div>
        </div>
    );
}