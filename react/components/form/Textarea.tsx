import React from 'react';
import { ReactElement } from 'react';

function Textarea({ value, onChange, label, height = undefined, placeholder = '', autoFocus }): ReactElement {
    function handleChange({ target: { value } }) {
        onChange(value);
    }
    return (
        <div className="input-raw">
            <label>
                <span className="input-label text">{label}</span>
                <textarea autoFocus={autoFocus} style={{ ...(height ? { minHeight: height } : {}) }} onChange={handleChange} value={value} placeholder={placeholder}/>
            </label>
        </div>
    );
}

export default Textarea;