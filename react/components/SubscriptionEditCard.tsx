import React, { ReactElement, useState } from 'react';
import Input from './form/Input';
import Button from './Button';

let timer;

function SubscriptionEditCard ({ name, price, duration, status, onChange }): ReactElement {
    const [state, setState] = useState({
        name,
        price,
        duration,
        status
    });

    const [updatedState, setUpdatedState] = useState({});

    function handleChange(f, v, type = undefined): void {
        setState({ ...state, [f]: v || '' });
        if (type === 'int' && !v) {
            return
        }
        const newState = {  ...updatedState, [f]: v };
        setUpdatedState(newState);
        clearTimeout(timer);
        timer = setTimeout(() => {
            onChange(newState);
            setUpdatedState({});
        }, 1000);
    }
    return (
        <div className="card px-20">
            <Input value={state.name} onChange={v => handleChange('name', v)} label="Название" />
            <Input type="number" value={state.price} onChange={v => handleChange('price', parseInt(v), 'int')} label="Цена" />
            <Input type="number" value={state.duration} onChange={v => handleChange('duration', parseInt(v), 'int')} label="Длительность в месяцах" />
            <div className="py-10">
                <Button
                    green={!state.status}
                    red={state.status === 1}
                    onClick={() => handleChange('status', state.status ? 0 : 1)}
                >
                    {state.status === 1 ? 'Скрыть' : 'Опубликовать'}
                </Button>
            </div>

        </div>
    );
}

export default SubscriptionEditCard;