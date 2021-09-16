import React, { ReactElement } from 'react';
import Paddingable from './Paddingable';
import Moment from 'react-moment';
import Button from './Button';

function SpecialTariff({ tariff, onBuy }): ReactElement {
    if (!tariff) {
        return null;
    }
    return (
        <div className="card">
            <Paddingable padding={[10, 25, 0]} className="flex flex-col flex-between h-100 flex-stretch">
                <h3 className="mt-0 mb-0">
                    Вы можете продлить подписку <span className="text-green">«{tariff.name}»</span> по прежней цене.
                </h3>
                <h4>Эта возможность исчезнет через <Moment fromNow locale="ru">{tariff.expired}</Moment></h4>
                <div>
                    <Button onClick={onBuy} green>Продлить по прежней цене</Button>
                </div>
            </Paddingable>
        </div>
    );
}

export default SpecialTariff;