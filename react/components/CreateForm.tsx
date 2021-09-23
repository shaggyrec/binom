import React, { ReactElement, useEffect, useState } from 'react';
import { slugify } from 'transliteration'

import Input from './form/Input';
import Button from './Button';
import Form from './form/Form';
import Select from './form/Select';

interface CreateFormInterface {
    onSubmit: (name: string, alias: string, category: string) => any
    categories?: {value: any; title: any}[];
}

function CreateForm({ onSubmit, categories = [] }: CreateFormInterface): ReactElement {
    const [entityName, setEntityName] = useState('');
    const [entityAlias, setEntityAlias] = useState('');
    const [entityCategory, setEntityCategory] = useState(categories[0]?.value || '');

    useEffect(() => {
        setEntityAlias(slugify(entityName, { replace: { '.': '', ':': '' } }));
    }, [entityName]);

    useEffect(() => {
        if (categories.length > 0 && entityCategory === '') {
            setEntityCategory(categories[0].value);
        }
    }, [categories]);

    function handleSubmit() {
        onSubmit(entityName, entityAlias, entityCategory);
    }

    return (
        <Form onSubmit={handleSubmit}>
            {categories.length > 0 && <Select options={categories} label="Категория" onChange={setEntityCategory} value={entityCategory}/>}
            <Input required onChange={setEntityName} label="Название" value={entityName}/>
            <Input required onChange={setEntityAlias} label="Alias" value={entityAlias}/>
            <Button block green>Создать</Button>
        </Form>
    );
}

export default CreateForm;