import React, { ReactElement } from 'react';
import CommentForm from './CommentForm';

function Comments({ onAdd }): ReactElement {
    return (
        <div>
            <CommentForm onSubmit={onAdd}/>
        </div>
    );
}
export default Comments;