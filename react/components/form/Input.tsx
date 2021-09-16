import React, { forwardRef, RefObject } from 'react';


// eslint-disable-next-line react/display-name
const Input = forwardRef(({ type = 'text', onChange, label, value, name = undefined, required = false, autocomplete = true,
    error = null, placeholder = undefined, min = undefined }: any, ref: RefObject<any>) => {
    const handleChange = ({ target: { value } }) => onChange(value);
    return (
        <div className="input-raw">
            <label>
                <span className="input-label text">{label}</span>
                <input
                    ref={ref}
                    className={error ? 'invalid' : ''}
                    type={type}
                    value={value}
                    onChange={handleChange}
                    name={name}
                    required={required}
                    // @ts-ignore
                    autoComplete={autocomplete ? 'on' : 'off'}
                    placeholder={placeholder}
                    min={min}
                />
                {error && <span className="input-error">{error}</span>}
            </label>
        </div>
    );
});

export default Input