import React from 'react';
import { ReactElement } from 'react';

function Textarea({ value, onChange, label }): ReactElement {
    function handleChange({ target: { value } }) {
        onChange(value);
    }
    return (
        <div className="input-raw">
            <label>
                <span className="input-label text">{label}</span>
                <textarea onChange={handleChange} value={value} />
            </label>
        </div>
    );
}

export default Textarea;