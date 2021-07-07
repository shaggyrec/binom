import React, { ReactElement } from 'react';
import { LessonComment } from '../../dataTypes/lessonComment';
import { User } from '../../dataTypes/user';
import { SERVER_REQUESTS_BASE } from '../../functions';
import { LessonCommentFile } from '../../dataTypes/lessonCommentFile';
import Moment from 'react-moment';

function authorsName(author: User): string {
    return author.name || author.username || author.email;
}

function renderFiles (files: LessonCommentFile[]) {
    if (!files || files.length === 0) {
        return null;
    }
    return (<div className="lesson-comment-files">
        {files?.map(f => (<div key={f.id} className="lesson-comment-file neomorphic">
            <a href={`${SERVER_REQUESTS_BASE}/file/${f.file.id}`} target="_blank">
                {f.file.type.indexOf('image') !== -1
                    ? <img src={`${SERVER_REQUESTS_BASE}/file/${f.file.id}`} className="lesson-comment-image"
                           alt={f.file.name} title={f.file.name}/>
                    : f.file.name
                }
            </a>
        </div>))
        }
    </div>);
}

function Comment(props: LessonComment): ReactElement {
    return (
        <div className="lesson-comment">
            <div className="neomorphic lesson-comment-block text">
                <div className="lesson-comment-header">
                    <div className="lesson-comment-avatar neomorphic">{authorsName(props.author)[0]}</div>
                    <div className="lesson-comment-author">
                        <div className="lesson-comment-author-name">{authorsName(props.author)}</div>
                        <div className="lesson-comment-author-date">
                            <Moment fromNow titleFormat="D MMM YYYY HH:mm:ss" withTitle locale="ru">
                                {props.created}
                            </Moment>
                        </div>
                    </div>
                </div>

                {props.text && <div>{props.text}</div>}
                {renderFiles(props.files)}
            </div>
        </div>
    );
}

export default Comment;