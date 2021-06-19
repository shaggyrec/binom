import React, { ReactElement, useEffect, useState } from 'react';
import { slugify } from 'transliteration'

import Input from './form/Input';
import Button from './Button';
import Form from './form/Form';

function TopicCreateForm({ onSubmit }): ReactElement {
    const [topicName, setTopicName] = useState('');
    const [topicAlias, setTopicAlias] = useState('');

    useEffect(() => {
        setTopicAlias(slugify(topicName));
    }, [topicName]);

    function handleSubmit() {
        onSubmit(topicName, topicAlias);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Input required onChange={setTopicName} label="Название" value={topicName}/>
            <Input required onChange={setTopicAlias} label="Alias" value={topicAlias}/>
            <Button block green>Создать</Button>
        </Form>
    );
}

export default TopicCreateForm;