import React, { ReactElement, useRef, useState } from 'react';
import Paddingable from '../Paddingable';

const EMPTY_FILE_LABEL = 'Загрузить файл';

function FileUpload({ onChange, label, accept = '*', name = 'file' }): ReactElement {
    const ref = useRef();
    const [title, setTitle] = useState(EMPTY_FILE_LABEL);
    const reset = () => {
        // @ts-ignore
        ref.current.files = null;
        // @ts-ignore
        ref.current.value = null;
        setTitle(EMPTY_FILE_LABEL);
    }
    function handleChange({ target: { files } }) {
        setTitle(files[0].name);
        onChange(files[0], reset);
    }
    return (
        <Paddingable padding={[0,0,20]}>
            <span className="input-label text">{label}</span>
            <div className="file-input">
                <label className="file-input-label">
                    <input ref={ref} type="file" name={name} className="file-input-input" onChange={handleChange} multiple={false} accept={accept}/>
                    <span>{title}</span>
                </label>
            </div>
        </Paddingable>
    );
}

export default FileUpload;