import React, { ReactElement, useEffect, useState } from 'react';
import { slugify } from 'transliteration'

import Input from './form/Input';
import Button from './Button';
import Form from './form/Form';
import Textarea from './form/Textarea';
import moment from 'moment';

function TopicEditForm({ onSubmit, name, alias, text, openDate }): ReactElement {
    const [topicName, setTopicName] = useState(name);
    const [topicAlias, setTopicAlias] = useState(alias);
    const [topicDescription, setTopicDescription] = useState(text);
    const [topicOpenDate, setTopicOpenDate] = useState(openDateValueForInput(openDate));

    useEffect(() => {
        setTopicAlias(slugify(topicName, { replace: { '.': '', ':': '' } }));
    }, [topicName]);

    function handleSubmit(): void {
        onSubmit({
            name: topicName,
            alias: topicAlias,
            text: topicDescription,
            openDate: topicOpenDate && moment(topicOpenDate).format('DD-MM'),
        });
    }

    function openDateValueForInput(val: string): string {
        if (!val) {
            return '';
        }
        return (new Date().getFullYear()) + '-' + val.split('-').reverse().join('-');
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Input required onChange={setTopicName} label="Название" value={topicName}/>
            <Textarea onChange={setTopicDescription} label="Описание" value={topicDescription || ''}/>
            <Input required onChange={setTopicAlias} label="Alias" value={topicAlias}/>
            <Input
                type="date"
                onChange={setTopicOpenDate}
                label="Дата, с которой тема доступна"
                value={topicOpenDate}
            />
            <Button block green>Сохранить</Button>
        </Form>
    );
}

export default TopicEditForm;