import React from 'react';
import { ReactElement } from 'react';

function Textarea({ value, onChange, label, height = undefined }): ReactElement {
    function handleChange({ target: { value } }) {
        onChange(value);
    }
    return (
        <div className="input-raw">
            <label>
                <span className="input-label text">{label}</span>
                <textarea style={{ ...(height ? { minHeight: height } : {}) }} onChange={handleChange} value={value} />
            </label>
        </div>
    );
}

export default Textarea;