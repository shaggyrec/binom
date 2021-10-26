import React, { ReactElement, useState } from 'react';
import Form from '../form/Form';
import TextAreaWithFileInput from '../form/TextAreaWithFileInput';
import Button from '../Button';
import Loader from '../Loader';

function PostForm({ text = '', files = [], onSubmit, loading = false }): ReactElement {
    const [postText, setPostText] = useState(text);
    const [postFiles, setPostFiles] = useState(files);

    function handleSubmit() {
        if (!postText && postFiles.length === 0) {
            return;
        }
        onSubmit(postText, postFiles);
    }

    return (
        <div className="relative">
            <Form onSubmit={handleSubmit}>
                <TextAreaWithFileInput
                    autoFocus
                    onTextChange={setPostText}
                    onFilesChange={setPostFiles}
                    label=""
                    text={postText}
                    files={postFiles}
                    placeholder="Напиши что-нибудь"
                    accept="image/*"
                />
                <Button block>Опубликовать</Button>
            </Form>
            <Loader show={loading} />
        </div>
    );
}

export default PostForm;