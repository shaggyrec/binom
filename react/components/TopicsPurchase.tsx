import React, { useState } from 'react';
import Paddingable from './Paddingable';
import Button from './Button';

function TopicsPurchase({ topics, chosen = [], onBuy }) {

    const [chosenTopics, setChosenTopics] = useState(chosen);

    function handleClickTopic(id) {
        setChosenTopics(
            chosenTopics.indexOf(id) !== -1 ? chosenTopics.filter(t => t !== id) : [...chosenTopics, id]
        );
    }

    function handleClickBuy() {
        onBuy(chosenTopics);
    }

    function renderTotal() {
        if (topics.length === 0 ) {
            return null;
        }
        if (chosenTopics.length === 0) {
            return 'Выбери темы из списка';
        }
        return (
            <div>
                Итого:{' '}
                {chosenTopics.length} тем на сумму
                {' '}
                { topics.reduce((acc, t) => chosenTopics.indexOf(t.id) !== -1 ? acc + t.price : acc, 0) } Р
            </div>
        );
    }

    return (
        <Paddingable padding={[20,0]}>
            <div className="lg:flex gap-20">
                <div className="w-33">
                    {topics.length === 0 && 'Похоже, что ты уже купил всё, что можно'}
                    {topics.map(t => (
                        <div
                            className={`neomorphic flex flex-between my-10 pointer transition2 ${chosenTopics.indexOf(t.id) !== -1 ? 'bg-green text-white' : ''}`}
                            key={`topic-purchase-${t.id}`}
                            onClick={() => handleClickTopic(t.id)}
                        >
                            <div>
                                <b>{t.name}</b>
                            </div>
                            <div>
                                {t.price} P
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-33">
                    {renderTotal()}
                    <div className="my-20">
                        {chosenTopics.length > 0 && <Button green onClick={handleClickBuy}>Перейти к оплате</Button>}
                    </div>
                </div>
            </div>
        </Paddingable>
    );
}

export default TopicsPurchase;