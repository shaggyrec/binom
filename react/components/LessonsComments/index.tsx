import React, { useState } from 'react';
import { ReactElement } from 'react';
import Textarea from '../form/Textarea';
import Button from '../Button';
import TextAreaWithFileInput from '../form/TextAreaWithFileInput';

function LessonComments({ comments, onLeaveComment }): ReactElement {
    const [newComment, setNewComment] = useState('');

    function handleLeaveComment() {
        if (newComment !== '') {
            onLeaveComment(newComment);
        }
    }

    return (
        <div>
            {comments.map(c => (
                <div>{c.text}</div>
            ))}
            <TextAreaWithFileInput
                label="Напиши комментарий или перетащи сюда файл с решением задания"
                onTextChange={setNewComment}
                text={newComment}
            />
            <Button block onClick={handleLeaveComment}>Отправить</Button>
        </div>
    );
}
export default LessonComments;