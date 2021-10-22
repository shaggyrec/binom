import React, { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as postsActions from '../ducks/posts';
import PostForm from '../components/feed/PostForm';

function Feed({ posts, requestPosts }): ReactElement {

    useEffect(() => {
        if (posts.length === 0) {
            requestPosts();
        }
    }, []);

    return (
        <div className="container w-600">
            <PostForm />
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        posts: state.posts.list,
    }),
    dispatch => ({
        requestPosts: () => dispatch(postsActions.requestList())
    })
)(Feed);