import React, { ReactElement } from 'react';
import { LessonComment } from '../../dataTypes/lessonComment';
import { User } from '../../dataTypes/user';

function authorsName(author: User): string {
    return author.name || author.username || author.email;
}

function Comment(props: LessonComment): ReactElement {
    return (
        <div className="lesson-comment">
            <div className="neomorphic lesson-comment-block text">
                <div className="lesson-comment-header">
                    <div className="lesson-comment-avatar neomorphic">{authorsName(props.author)[0]}</div>
                    <div className="lesson-comment-author">
                        <div className="lesson-comment-author-name">{authorsName(props.author)}</div>
                        <div className="lesson-comment-author-date">{props.created}</div>
                    </div>
                </div>

                {props.text && <div>{props.text}</div>}
                {props.files?.map(f => (<div key={f.id}>
                    {f.id}
                </div>))}
            </div>
        </div>
    );
}

export default Comment;