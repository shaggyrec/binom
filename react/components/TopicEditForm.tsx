import React, { ReactElement, useEffect, useState } from 'react';
import { slugify } from 'transliteration'

import Input from './form/Input';
import Button from './Button';
import Form from './form/Form';
import Textarea from './form/Textarea';

function TopicEditForm({ onSubmit, name, alias, text }): ReactElement {
    const [topicName, setTopicName] = useState(name);
    const [topicAlias, setTopicAlias] = useState(alias);
    const [topicDescription, setTopicDescription] = useState(text);

    useEffect(() => {
        setTopicAlias(slugify(topicName));
    }, [topicName]);

    function handleSubmit() {
        onSubmit({
            name: topicName,
            alias: topicAlias,
            text: topicDescription,
        });
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Input required onChange={setTopicName} label="Название" value={topicName}/>
            <Textarea onChange={setTopicDescription} label="Описание" value={topicDescription}/>
            <Input required onChange={setTopicAlias} label="Alias" value={topicAlias}/>
            <Button block green>Сохранить</Button>
        </Form>
    );
}

export default TopicEditForm;