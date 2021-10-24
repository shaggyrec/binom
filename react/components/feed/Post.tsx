import React, { ReactElement } from 'react';
import { Post } from '../../dataTypes/post';
import { User } from '../../dataTypes/user';
import Moment from 'react-moment';
import { SERVER_REQUESTS_BASE } from '../../functions';
import ImagesCarousel from './ImagesCarousel';

function authorsName(author: User): string {
    return author.name || author.username || author.email;
}

function Post({ post }: { post: Post }): ReactElement {
    return (
        <div className="post">
            <div className="neomorphic lesson-comment-block text">
                <div className="post-header">
                    <div className="post-avatar neomorphic">{authorsName(post.user)[0]}</div>
                    <div className="post-author">
                        <div className="post-author-name">{authorsName(post.user)}</div>
                        <div className="post-author-date">
                            <Moment fromNow titleFormat="D MMM YYYY HH:mm:ss" withTitle locale="ru">
                                {post.created}
                            </Moment>
                        </div>
                    </div>
                </div>
                <p>{post.text}</p>
                <ImagesCarousel images={post.images}/>
            </div>
        </div>
    );
}
export default Post;