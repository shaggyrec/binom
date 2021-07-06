import React, { useState, ReactElement } from 'react';
import Button from '../Button';
import TextAreaWithFileInput from '../form/TextAreaWithFileInput';
import Comment from './Comment';

function LessonComments({ comments, onLeaveComment }): ReactElement {
    const [commentText, setCommentText] = useState('');
    const [files, setFiles] = useState([]);

    function handleLeaveComment() {
        if (commentText !== '' || files.length > 0) {
            onLeaveComment(commentText, files);
        }
    }

    return (
        <div className="lesson-comments">
            {comments.map(c => <Comment key={c.id} {...c} />)}
            <TextAreaWithFileInput
                label="Напиши комментарий или перетащи сюда файл с решением задания"
                onTextChange={setCommentText}
                text={commentText}
                onFilesChange={setFiles}
            />
            <Button block onClick={handleLeaveComment}>Отправить</Button>
        </div>
    );
}
export default LessonComments;