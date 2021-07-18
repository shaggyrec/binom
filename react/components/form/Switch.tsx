import React from 'react';

function Switch({ label, name }) {
    return (
        <div>
            <label className="label">
                <div className="toggle">
                    <input className="toggle-state" type="checkbox" name={name} />
                    <div className="indicator"/>
                </div>
                <div className="label-text">{label}</div>
            </label>
        </div>
    )
}

export default Switch;