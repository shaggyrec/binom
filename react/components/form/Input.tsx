import React from 'react';

function Input({ type = 'text', onChange, label, value, name = undefined, required = false, autocomplete = true, error = null, placeholder = undefined }) {
    const handleChange = ({ target: { value } }) => onChange(value);
    return (
        <div className="input-raw">
            <label>
                <span className="input-label text">{label}</span>
                <input
                    className={error ? 'invalid' : ''}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    name={name}
                    required={required}
                    // @ts-ignore
                    autoComplete={autocomplete ? 'on' : 'off'}
                    placeholder={placeholder}
                />
                {error && <span className="input-error">{error}</span>}
            </label>
        </div>
    );
}

export default Input;