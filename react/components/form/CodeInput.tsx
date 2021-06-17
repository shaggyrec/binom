import React from 'react';
import Input from './Input';

function CodeInput({ value, onChange, error }) {
    return <Input error={error} required={true} name="code" type="number" value={value} label="" onChange={onChange} autocomplete={false}/>
}

export default CodeInput;