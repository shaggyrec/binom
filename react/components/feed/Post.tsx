import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../dataTypes/post';
import { User } from '../../dataTypes/user';
import Moment from 'react-moment';
import ImagesCarousel from './ImagesCarousel';
import Paddingable from '../Paddingable';
import Button from '../Button';
import Comments from './Comments';

function authorsName(author: User): string {
    return author.name || author.username || author.email;
}

function Post({ post, onAddComment }: { post: Post, onAddComment: (text: string) => any }): ReactElement {
    const [showCommentsForm, setShowCommentsForm] = useState(false);

    return (
        <div className="post">
            <div className="neomorphic text">
                <div className="post-header">
                    <Link to={`/@${post.user.username}`} className="post-avatar neomorphic">{authorsName(post.user)[0]}</Link>
                    <div className="post-author">
                        <Link to={`/@${post.user.username}`} className="post-author-name">{authorsName(post.user)}</Link>
                        <div className="post-author-date">
                            <Moment fromNow titleFormat="D MMM YYYY HH:mm:ss" withTitle locale="ru">
                                {post.created}
                            </Moment>
                        </div>
                    </div>
                </div>
                <p>{post.text}</p>
                <ImagesCarousel images={post.images}/>
                <Paddingable padding={[10,0,0]}>
                    {showCommentsForm
                        ? <Comments onAdd={onAddComment}/>
                        : <Button className="px-30" small onClick={setShowCommentsForm}><small>Комментировать</small></Button>
                    }
                </Paddingable>
            </div>
        </div>
    );
}
export default Post;