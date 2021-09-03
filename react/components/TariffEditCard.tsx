import React, { ReactElement, useEffect, useState } from 'react';
import Input from './form/Input';
import Button from './Button';
import { usePrevious } from '../hooks/usePrevious';
import Textarea from './form/Textarea';
import { Bin } from './Icons';
import Paddingable from './Paddingable';


function TariffEditCard ({ name, prices, description, status, onChange, onDelete, onAddPrice, onChangePrice, onDeletePrice }): ReactElement {
    const [state, setState] = useState({
        name,
        description,
        prices: prices || [],
        status
    });

    const [updatedState, setUpdatedState] = useState({});

    const prevState = usePrevious(updatedState)
    const prevPrices = usePrevious(prices)

    useEffect(() => {
        if (typeof prevState === 'undefined' || Object.keys(updatedState).length === 0) {
            return
        }
        onChange(updatedState);
        setUpdatedState({});
    }, [updatedState]);

    useEffect(() => {
        if (typeof prevPrices === 'undefined' || prevPrices.length === prices.length) {
            return
        }
        setState({ ...state, prices });
    }, [prices])


    function handleChange(f, v, type = undefined): void {
        setState({ ...state, [f]: v });
        if (type === 'int' && !v && v !== 0) {
            return
        }
        setUpdatedState({  ...updatedState, [f]: v });
    }

    function handleChangePrice (id, f, v) {
        const prices = state.prices.map(p => p.id === id ? { ...p, [f]: v } : p);
        setState({ ...state, prices });
        if (!v) {
            return
        }
        onChangePrice(id, { [f]: v })
    }

    function handleAddPrice(): void {
        onAddPrice({ price: 3000, duration: 1 });
    }

    function handleDeletePrice(id): void {
        onDeletePrice(id);
    }

    function handleClickDelete () {
        if (confirm('Точно?')) {
            onDelete();
        }
    }

    function renderPrices () {
        return state.prices.map((price, i) => (
            <div className="flex flex-vertical-centered gap-10" key={`price${i}`}>
                <div style={{ width: 75 }}>
                    <Input type="number" value={price.duration || ''} onChange={v => handleChangePrice(price.id,'duration', parseInt(v))} label="Месяцев" />
                </div>
                <Input type="number" value={price.price || ''} onChange={v => handleChangePrice(price.id, 'price', parseInt(v))} label="Цена" />
                <Paddingable padding={[20,0,0]}>
                    <Button small red onClick={() => handleDeletePrice(price.id)}><Bin size={16} fill="#fff"/></Button>
                </Paddingable>
            </div>
        ));
    }

    return (
        <div className="card px-20">
            <Input value={state.name} onChange={v => handleChange('name', v)} label="Название" />
            <Textarea
                height={30}
                label="Описание"
                value={state.description}
                onChange={v => handleChange('description', v)}
            />
            <div className="py-10">
                {renderPrices()}
                <Button onClick={handleAddPrice}>Добавить цену</Button>
            </div>
            <div className="py-10 flex gap-20">
                <Button
                    green={!state.status}
                    red={state.status === 1}
                    onClick={() => handleChange('status', state.status ? 0 : 1, 'int')}
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

export default TariffEditCard;