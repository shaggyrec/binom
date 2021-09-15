import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';

import Paddingable from './Paddingable';
import { UserRole } from '../dataTypes/user';

function DemoUserMessage({ user }): ReactElement {
    return (
        user.role === UserRole.admin || user.subscription
            ? null
            : (
                <Paddingable padding={[10, 0]}>
                    <Paddingable padding={[20, 10]} className="badge badge-red">
                            Демо-версия. Доступны только две темы и недоступны домашние задания обратная связь.&nbsp;
                        <Link to={`/@${user.username}#buy`} className="text-white">Оформите подписку, чтобы получить полный доступ.</Link>
                    </Paddingable>
                </Paddingable>
            )
    );
}

export default DemoUserMessage;