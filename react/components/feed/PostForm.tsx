import React, { ReactElement, useState } from 'react';
import Form from '../form/Form';
import TextAreaWithFileInput from '../form/TextAreaWithFileInput';

function PostForm({ text = '', files = [] }): ReactElement {
    const [postText, setPostText] = useState(text);
    const [postFiles, setPostFiles] = useState(files);

    function handleSubmit() {
        if (postText && postFiles.length === 0) {
            return;
        }
        return
    }

    return (
        <Form onSubmit={handleSubmit}>
            <TextAreaWithFileInput
                onTextChange={setPostText}
                onFilesChange={setPostFiles}
                label=""
                text={postText}
                files={postFiles}
                placeholder="Напишите что-нибудь"
            />
        </Form>
    );
}

export default PostForm;