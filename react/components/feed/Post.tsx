import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../dataTypes/post';
import { User } from '../../dataTypes/user';
import Moment from 'react-moment';
import ImagesCarousel from './ImagesCarousel';
import Paddingable from '../Paddingable';
import Comments from './Comments';
import Loader from '../Loader';

function authorsName(author: User): string {
    return author.name || author.username || author.email;
}

function Post({ post, onAddComment, creatingComment, error, comments, onRequestComments, commentsRequesting }: { post: Post, onAddComment: (text: string) => any, creatingComment: boolean, error: any, comments: Post[], onRequestComments: () => any, commentsRequesting: boolean }): ReactElement {
    return (
        <div className="post">
            <div className="neomorphic text">
                <div className="post-header">
                    <Link to={`/@${post.user.username}`} className="post-avatar neomorphic">{authorsName(post.user)[0]}</Link>
                    <div className="post-author">
                        <Link to={`/@${post.user.username}`} className="post-author-name">{authorsName(post.user)} (@{post.user.username})</Link>
                        <div className="post-author-date">
                            <Moment fromNow titleFormat="D MMM YYYY HH:mm:ss" withTitle locale="ru">
                                {post.created}
                            </Moment>
                        </div>
                    </div>
                </div>
                <p className="wrap">{post.text}</p>
                <ImagesCarousel images={post.images}/>
                <div className="relative">
                    <Paddingable padding={[10,0,0]}>
                        <Comments
                            amount={post.commentsAmount}
                            onAdd={onAddComment}
                            comments={comments}
                            loading={creatingComment}
                            error={error}
                            onRequestAll={onRequestComments}
                        />
                    </Paddingable>
                    <Loader show={commentsRequesting || creatingComment}/>
                </div>
            </div>
        </div>
    );
}
export default Post;