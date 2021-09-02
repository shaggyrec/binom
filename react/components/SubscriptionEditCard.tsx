import React, { ReactElement, useEffect, useState } from 'react';
import Input from './form/Input';
import Button from './Button';
import { usePrevious } from '../hooks/usePrevious';


function SubscriptionEditCard ({ name, prices, status, onChange, onDelete }): ReactElement {
    let timer;

    const [state, setState] = useState({
        name,
        prices: prices || [],
        status
    });

    const prevState = usePrevious(state)

    useEffect(() => {
        if (typeof prevState === 'undefined') {
            return
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
            onChange(state);
            setUpdatedState({});
        }, 1000);
    }, [state])

    const [updatedState, setUpdatedState] = useState({});


    function handleChange(f, v, type = undefined): void {
        setState({ ...state, [f]: v || '' });
        if (type === 'int' && !v) {
            return
        }
        setUpdatedState({  ...updatedState, [f]: v });
    }

    function handleChangePrices (index, f, v) {
        setState({ ...state, prices: state.prices.map((p, i) => i === index ? { ...p, [f]: v } : p) })
    }

    function handleClickDelete () {
        if (confirm('Точно?')) {
            onDelete()
        }
    }

    function handleAddPrice(): void {
        setState({ ...state, prices: [...state.prices, { price: 3000, duration: 1 }] })
    }

    function renderPrices () {
        return state.prices.map((price, i) => (
            <div className="flex gap-10" key={`price${i}`}>
                <div style={{ width: 75 }}>
                    <Input type="number" value={price.duration} onChange={v => handleChangePrices(i,'duration', parseInt(v))} label="Месяцев" />
                </div>
                <Input type="number" value={price.price} onChange={v => handleChangePrices(i, 'price', parseInt(v))} label="Цена" />
            </div>
        ));
    }

    return (
        <div className="card px-20">
            <Input value={state.name} onChange={v => handleChange('name', v)} label="Название" />
            <div className="py-10">
                {renderPrices()}
                <Button onClick={handleAddPrice}>Добавить цену</Button>
            </div>
            <div className="py-10 flex gap-20">
                <Button
                    green={!state.status}
                    red={state.status === 1}
                    onClick={() => handleChange('status', state.status ? 0 : 1)}
                >
                    {state.status === 1 ? 'Скрыть' : 'Опубликовать'}
                </Button>
                <Button red onClick={handleClickDelete}>
                    Удалить
                </Button>
            </div>

        </div>
    );
}

export default SubscriptionEditCard;