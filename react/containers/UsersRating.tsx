import React, { ReactElement, useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as usersRatingActions from '../ducks/usersRating';
import RatingTable from '../components/RatingTable';
import Paddingable from '../components/Paddingable';
import Loader from '../components/Loader';

function UsersRating({ requestRating, rating, loading, username }): ReactElement {

    useEffect(() => {
        if (rating === null) {
            requestRating()
        }
    }, [])

    return (
        rating && !loading
            ? (
                <div className="container w-600 centered">
                    <h1>Рейтинг</h1>
                    <RatingTable rating={rating} username={username}/>
                </div>
            ) : <Loader show={true} />
    );
}

export default connect(
    (state: RootState) => ({
        rating: state.usersRating.rating,
        loading: state.usersRating.loading,
        username: state.users.me?.username,
    }),
    dispatch => ({
        requestRating: () => dispatch(usersRatingActions.request())
    })
)(UsersRating);