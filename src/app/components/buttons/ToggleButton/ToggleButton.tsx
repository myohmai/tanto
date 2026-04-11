import './ToggleButton.scss'

type Props = {
    isToggleOn: boolean;
    onClick: () => void;
}

export const ToggleButton = ({ isToggleOn, onClick }: Props ) => {
    return (
        <button type='button' onClick={onClick} className={`toggle-button ${ isToggleOn? 'on' : 'off'}`} aria-label={isToggleOn? 'On' : 'Off'} aria-pressed={isToggleOn}>
            <div className='toggle-button__knob'></div>
        </button>
    )
}