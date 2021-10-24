import React, { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as postsActions from '../ducks/posts';
import PostForm from '../components/feed/PostForm';
import Paddingable from '../components/Paddingable';
import Post from '../components/feed/Post';

function Feed({ posts, requestPosts, createPost, creating }): ReactElement {

    useEffect(() => {
        if (posts.length === 0) {
            requestPosts();
        }
    }, []);

    return (
        <div className="container w-600">
            <PostForm onSubmit={createPost} loading={creating}/>
            <Paddingable padding={[20, 0]}>
                {posts.map(p => (
                    <Paddingable key={p.id} padding={[10, 0]}>
                        <Post post={p}/>
                    </Paddingable>
                ))}
            </Paddingable>
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        posts: state.posts.list,
        creating: state.posts.creating,
    }),
    dispatch => ({
        requestPosts: () => dispatch(postsActions.requestList()),
        createPost: (text, images) => dispatch(postsActions.create({ text,images })),
    })
)(Feed);