import { combineReducers, Reducer } from 'redux';
import topics, { initialState as topicsState } from './topics';
import users, { initialState as usersState } from './users';
import auth, { initialState as authState } from './auth';
import application, { initialState as applicationState } from './application';
import lessons, { initialState as lessonsState } from './lessons';
import files, { initialState as filesState } from './files';
import lessonComments, { initialState as lessonCommentsState } from './lessonComments';
import notifications, { initialState as notificationsState } from './notifications';
import learningProgress, { initialState as learningProgressState } from './learningProgress';
import subscriptions, { initialState as subscriptionsState } from './subscriptions';
import usersRating, { initialState as usersRatingState } from './usersRating';
import posts, { initialState as postsState } from './posts';
import postComments, { initialState as postCommentsState } from './postComments';
import courses, { initialState as coursesState } from './courses';

export const initialState = {
    topics: topicsState,
    users: usersState,
    auth: authState,
    application: applicationState,
    lessons: lessonsState,
    files: filesState,
    lessonComments: lessonCommentsState,
    notifications: notificationsState,
    learningProgress: learningProgressState,
    subscriptions: subscriptionsState,
    usersRating: usersRatingState,
    posts: postsState,
    postComments: postCommentsState,
    courses: coursesState,
};

export default (router: any = null): Reducer => combineReducers({
    router,
    topics,
    users,
    auth,
    application,
    lessons,
    files,
    lessonComments,
    notifications,
    learningProgress,
    subscriptions,
    usersRating,
    posts,
    postComments,
    courses,
});