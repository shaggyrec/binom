import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import Button from './Button';

function UserSubscriptions({ subscriptions, topics }) {
    const [chosenTab, setChosenTab] = useState(0);
    const allPaidTopics = subscriptions.reduce((topics, s) => [...topics, ...s.topics], [])

    function topicsByIds(topicsIds) {
        return topics.filter(t => topicsIds.indexOf(t.id) !== -1);
    }
    function renderSubscriptions() {
        return (
            <table className="w-100 table">
                <tbody>
                    {subscriptions.map(s => (
                        <tr key={`user-subscription-${s.id}`}>
                            <td><b>{s.name}</b></td>
                            <td>
                                {topicsByIds(s.topics).map(t => (
                                    <div key={`paid-topic-${s.id}-${t.id}`}>{t.name}</div>
                                ))}
                            </td>
                            <td className="text-right">c <Moment locale="ru" format="DD MMMM YYYY">{s.created}</Moment></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    function renderTopics() {
        return (
            <div>
                {topicsByIds(allPaidTopics).map(t => <div key={`paid-topic-${t.id}`} className="my-10">{t.name}</div>)}
            </div>
        );
    }

    return (
        <div>
            <div className="flex gap-20">
                <Button block green={chosenTab === 0} className="w-50" onClick={() => setChosenTab(0)}>
                    Подписки
                </Button>
                <Button block green={chosenTab === 1} className="w-50" onClick={() => setChosenTab(1)}>
                    Купленные темы
                </Button>
            </div>
            <div className='neomorphic my-20'>
                {chosenTab === 0 ? renderSubscriptions() : renderTopics()}
            </div>
            <Link to="/buy">
                <Button green block>Купить еще</Button>
            </Link>
        </div>
    );
}

export default UserSubscriptions;