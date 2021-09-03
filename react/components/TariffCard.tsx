import React, { ReactElement, useState } from 'react';
import Paddingable from './Paddingable';
import Button from './Button';
import Select from './form/Select';

function priceTitle(price): string {
    return price.price + ' на ' + price.duration + ' мес'
}

function TariffCard({ tariff, onBuy }): ReactElement {

    const [selectedPrice, setSelectedPrice] = useState(tariff.prices && tariff.prices[0].id)

    function handleClickBuy(): void {
        onBuy(tariff.id, selectedPrice)
    }

    return (
        <div className="card h-100">
            <Paddingable padding={[10, 25, 0]} className="flex flex-col flex-between h-100 flex-stretch">
                <h3 className="mt-0 mb-0 text-green">{tariff.name}</h3>
                <div className="wrap text-xs line-height-2">
                    {tariff.description}
                </div>
                {tariff.prices && <Select
                    options={tariff.prices.map(p => ({ value: p.id, title: priceTitle(p) }))}
                    value={selectedPrice}
                    onChange={setSelectedPrice}
                    label=""/>
                }
                {selectedPrice &&
                    <Paddingable padding={[20, 0, 0]}>
                        <Button onClick={handleClickBuy} green block>Купить</Button>
                    </Paddingable>
                }
            </Paddingable>
        </div>
    );
}

export default TariffCard;