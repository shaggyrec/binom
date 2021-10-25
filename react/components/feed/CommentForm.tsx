import React, { ReactElement, useState } from 'react';
import Form from '../form/Form';
import TextAreaWithFileInput from '../form/TextAreaWithFileInput';
import Button from '../Button';
import Loader from '../Loader';
import Textarea from '../form/Textarea';

function CommentForm({ text = '', onSubmit, loading = false }): ReactElement {
    const [postText, setPostText] = useState(text);

    function handleSubmit() {
        if (!postText) {
            return;
        }
        onSubmit(postText);
    }

    return (
        <div className="relative">
            <Form onSubmit={handleSubmit}>
                <Textarea
                    autoFocus
                    height={20}
                    onChange={setPostText}
                    label=""
                    value={postText}
                    placeholder="Твой комментарий"
                />
                <div style={{ marginTop: -34 }}>
                    <Button small block><small>Опубликовать</small></Button>
                </div>
            </Form>
            <Loader show={loading} />
        </div>
    );
}

export default CommentForm;