import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as postsActions from '../ducks/posts';
import PostForm from '../components/feed/PostForm';
import Paddingable from '../components/Paddingable';
import Post from '../components/feed/Post';
import Button from '../components/Button';
import { usePrevious } from '../hooks/usePrevious';

function Feed({ posts, requestPosts, createPost, creating, error, createComment }): ReactElement {

    const [showCreateForm, setShowCreateForm] = useState(false);
    const prevCreating = usePrevious(creating);

    useEffect(() => {
        if (posts.length === 0) {
            requestPosts();
        }
    }, []);

    useEffect(() => {
        if (prevCreating === true && creating === false && !error) {
            setShowCreateForm(false);
        }
    }, [creating]);

    return (
        <div className="container w-600">
            <Paddingable padding={[30,0,0]}>
                {showCreateForm
                    ? <PostForm onSubmit={createPost} loading={creating}/>
                    : <Button onClick={() => setShowCreateForm(true)} block>Создать пост</Button>
                }
            </Paddingable>
            <Paddingable padding={[20, 0]}>
                {posts.map(p => (
                    <Paddingable key={p.id} padding={[10, 0]}>
                        <Post post={p} onAddComment={text => createComment(p.id, text)}/>
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
        error: state.posts.error,
    }),
    dispatch => ({
        requestPosts: () => dispatch(postsActions.requestList()),
        createPost: (text, images) => dispatch(postsActions.create({ text,images })),
        createComment: () => {}
    })
)(Feed);