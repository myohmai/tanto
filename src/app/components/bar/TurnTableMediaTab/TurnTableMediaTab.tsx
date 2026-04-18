import './TurnTableMediaTab.scss'

type TurnTableMediaType = 'Video' | 'Music';

type Props = {
    selectedTab: TurnTableMediaType;
    onChange: (value: TurnTableMediaType) => void;
}

export const TurnTableMediaTab = ({ selectedTab, onChange}: Props) => {
    return(
        <div className='turn-table-media-tab padding-md-lg inline-md'>
            <button type='button' onClick={() => onChange('Video')} className={`turn-table-media-tab__button padding-xs-md ${selectedTab === 'Video' ? 'is-selected': ''}`}>
                Video
            </button>
            <button type='button' onClick={() => onChange('Music')} className={`turn-table-media-tab__button padding-xs-md ${selectedTab === 'Music' ? 'is-selected': ''}`}>
                Music
            </button>
        </div>
    )
}