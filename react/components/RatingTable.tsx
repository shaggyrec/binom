import React, { ReactElement } from 'react';
import { UsersRating } from '../dataTypes/usersRating';

function RatingTable({ rating, username }: { rating: UsersRating[], username: string }): ReactElement {
    return (
        <table className="table text">
            <thead>
                <tr>
                    <th>&nbsp;</th>
                    <th>&nbsp;</th>
                    <th align="right">Тем пройдено</th>
                    <th align="right">Рейтинг</th>
                </tr>
            </thead>
            <tbody>
                {rating.map(r => (
                    <tr key={r.username} className={username === r.username ? 'active' : ''}>
                        <td>{r.name}</td>
                        <td>@{r.username}</td>
                        <td align="right">{r.topicsPassed}</td>
                        <td align="right"><b className="pr-5">{r.score}</b></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default RatingTable
