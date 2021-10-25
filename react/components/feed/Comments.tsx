import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CommentForm from './CommentForm';
import { Post } from '../../dataTypes/post';
import Button from '../Button';
import { usePrevious } from '../../hooks/usePrevious';

function Comments({ onAdd, comments, loading, error }: { onAdd: (any: any) => any; comments: Post[], loading: boolean, error: any }): ReactElement {
    const [showCommentsForm, setShowCommentsForm] = useState(false);
    const prevCreatingComment = usePrevious(loading);

    useEffect(() => {
        if (prevCreatingComment === true && loading === false && !error) {
            setShowCommentsForm(false);
        }
    }, [loading]);
    return (
        <div>
            <div>
                {comments?.map(c => (
                    <div key={c.id} className="post-comment">
                        <Link to={`/@${c.user.username}`}>{c.user.name}(@{c.user.username})</Link>&nbsp;
                        <span>{c.text}</span>
                    </div>
                ))}
            </div>
            {showCommentsForm
                ? <CommentForm onSubmit={onAdd}/>
                : <Button className="px-30 py-5 text-xxs" small onClick={setShowCommentsForm}><small>Комментировать</small></Button>
            }
        </div>
    );
}
export default Comments;