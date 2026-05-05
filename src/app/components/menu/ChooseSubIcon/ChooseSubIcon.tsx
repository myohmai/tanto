'use client';

import { FondIcon, BiasColor } from '@/app/components/icons'
import { SubmitButton } from '@/app/components/buttons/SubmitButton'
import { BottomSheet } from '@/app/components/menu/BottomSheet' 
import { UserSubIcon } from '@/app/components/custom-icon/UserCustomIcon';

import { useState } from 'react';

import './ChooseSubIcon.scss'

type Props = {
    onSubmit: (icon: UserSubIcon)=> void;
    isOpen: boolean;
    onClose: () => void;
}

export const ChooseSubIcon = ({ onSubmit, isOpen, onClose }: Props ) => {
    const [selectedSubIcon, setSelectedSubIcon] = useState<UserSubIcon | null>(null)
    const [emojiValue, setEmojiValue] = useState('')
    const [emojiError, setEmojiError] = useState('')
    return(
        <BottomSheet isOpen={isOpen} onClose={onClose} contentClassName='choose-sub-icon stack-lg' >
            <div className='choose-sub-icon__title'>Choose a color or emoji for your sub icon</div>
            <div className="choose-sub-icon__icons">
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'red' ? 'is-selected' : '' }`} onClick={() => setSelectedSubIcon({ type: 'fond', value: 'red'})}>
                    <FondIcon bias="red" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'orange' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'orange'})}>
                    <FondIcon bias="orange" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'light-orange' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'light-orange'})}>
                    <FondIcon bias="light-orange" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'yellow' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'yellow'})}>
                    <FondIcon bias="yellow" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'yellow-green' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'yellow-green'})}>
                    <FondIcon bias="yellow-green" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'green' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'green'})}>
                    <FondIcon bias="green" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'turquoise' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'turquoise'})}>
                    <FondIcon bias="turquoise" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'sky-blue' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'sky-blue'})}>
                    <FondIcon bias="sky-blue" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'blue' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'blue'})}>
                    <FondIcon bias="blue" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'navy' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'navy'})}>
                    <FondIcon bias="navy" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'purple' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'purple'})}>
                    <FondIcon bias="purple" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'lavender' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'lavender'})}>
                    <FondIcon bias="lavender" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'amethyst' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'amethyst'})}>
                    <FondIcon bias="amethyst" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'pink' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'pink'})}>
                    <FondIcon bias="pink" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'baby-pink' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'baby-pink'})}>
                    <FondIcon bias="baby-pink" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'silver' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'silver'})}>
                    <FondIcon bias="silver" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'black' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'black'})}>
                    <FondIcon bias="black" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'gold' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'gold'})}>
                    <FondIcon bias="gold" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'brown' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'brown'})}>
                    <FondIcon bias="brown" />
                </button>
                <button type='button' className={`choose-sub-icon__icons--button ${selectedSubIcon?.type === 'fond' && selectedSubIcon.value === 'white' ? 'is-selected' : '' }`}  onClick={() => setSelectedSubIcon({ type: 'fond', value: 'white'})}>
                    <FondIcon bias="white" />
                </button>
            </div>
            <div className="input-box">
                <div className="input-box__container">
                    <div className="input-box__label">emoji</div>
                    <input 
                        className='input-box__text-box'
                        type="text" 
                        value={emojiValue} 
                        maxLength={2} 
                        onChange={(e) => {
                            const value = e.target.value
                            setEmojiValue(value)
                            const isEmoji = /\p{Extended_Pictographic}/u.test(value)
                            if (!isEmoji && value !== '') {
                                setEmojiError('Emoji only')
                                return
                            }

                            setEmojiError('')

                            setSelectedSubIcon({
                                type: 'emoji',
                                value
                            })
                        }} />
                </div>
                {emojiError && (
                    <div className="input-box__error">{emojiError}</div>
                )}
            </div>
            <SubmitButton label='Submit' onClick={() => {
                if (emojiError) return
                if (!selectedSubIcon) return

                onSubmit(selectedSubIcon)
            }}
            disabled={!!emojiError || !selectedSubIcon} />
        </BottomSheet>
    )
}