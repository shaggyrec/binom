import React, { ReactElement, useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone'

import Textarea from './Textarea';
import Button from '../Button';
import { Attach, Bin } from '../Icons';

function TextAreaWithFileInput({ label = '', text, onTextChange, onFilesChange }): ReactElement {
    const [files, setFiles] = useState([]);
    const onDrop = useCallback(acceptedFiles => {
        setFiles([...files, ...acceptedFiles]);
        onFilesChange(files);
    }, [])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const handleClickDropzone = e => {
        e.stopPropagation();
    }
    const handleDeleteFile = i => {
        setFiles([...files.slice(0, i), ...files.slice(i + 1)]);
        onFilesChange(files);
    }

    return (
        <div className="textarea-with-files">
            <div
                {...getRootProps({
                    onClick: handleClickDropzone
                })}
                className="textarea-with-files-dropzone"
            >
                <input {...getInputProps()} />
                <Textarea height={100} label={label} onChange={onTextChange} value={text}/>
                {isDragActive && <div className="textarea-with-files-tooltip text">Drop file here</div>}
                <div className="textarea-with-files-controls neomorphic">
                    <Button small><Attach size={12}/></Button>
                </div>
            </div>
            {files.length > 0 &&
                <div className="textarea-with-files-list text">
                    {files.map((f, i) => (
                        <div key={`${i}${f.name}`} className="textarea-with-files-list-item">
                            <span className="textarea-with-files-list-item-name">{f.name}</span>
                            <Button small red onClick={() => handleDeleteFile(i)}><Bin size={12} fill="#fff"/></Button>
                        </div>)
                    )}
                </div>
            }
        </div>
    );
}

export default TextAreaWithFileInput;