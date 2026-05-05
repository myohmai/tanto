import '@/app/styles/globals.scss'

type Props = {
    keywordHint?: string;
    error?: string;
    onChange: (value: string) => void;
}

export const EntryKeyword = ({ keywordHint, error, onChange }: Props ) => {
    return(
        <div className="input-box">
            <div className="input-box__container">
                {keywordHint && (
                    <div className='input-box__label'>{keywordHint}</div>
                )}
                <input
                    type="text"
                    className="input-box__text-box"
                    placeholder='KEYWORD'
                    maxLength={30}
                    onChange={(e) => {
                        onChange(e.target.value);
                    }}
                    />
            </div>
            {error && (<div className="input-box__error">{error}</div>)}
        </div>
    )
}