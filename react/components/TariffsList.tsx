import React, { ReactElement } from 'react';
import TariffCard from './TariffCard';
import Paddingable from './Paddingable';

function TariffsList ({ tariffs, onBuy }): ReactElement {
    return (
        <div className="flex flex-wrap flex-stretch">
            {tariffs.map(t => (
                <Paddingable padding={[20, 10, 20, 0]} key={`tariff-${t.id}`} className="w-33">
                    <TariffCard tariff={t} onBuy={onBuy}/>
                </Paddingable>
            ))}
        </div>
    );
}

export default TariffsList;