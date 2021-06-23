import React, { ReactElement } from 'react';

function Select({ label, options, value, onChange, error = null }): ReactElement {
    function handleChange ({ target: { value } }) {
        onChange(value);
    }
    return (
        <div className="input-raw">
            <label>
                <span className="input-label text">{label}</span>
                <select onChange={handleChange} value={value}>
                    {options.map(o => (<option key={'select-option' + o.value} value={o.value}>{o.title}</option>))}
                </select>
                {error && <span className="input-error">{error}</span>}
            </label>
        </div>
    );
}

export default Select;