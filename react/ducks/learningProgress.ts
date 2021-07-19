import { handleActions, createAction } from 'redux-actions';

const SAVE = 'learningProgress/SAVE';
const REQUEST_FOR_LESSON = 'learningProgress/REQUEST_FOR_LESSON';
const PROGRESS_FOR_LESSON = 'learningProgress/PROGRESS_FOR_LESSON';

export const initialState = {
    list: {}
}

export default handleActions({
    [PROGRESS_FOR_LESSON]: (state, { payload }) => ({ ...state, list: { ...state.list, ...payload }})
}, initialState);

export const save = createAction(SAVE, (lessonAlias, userId, passed) => ({ lessonAlias, userId, passed }));
export const requestProgressForLesson = createAction(REQUEST_FOR_LESSON, (lessonAlias, userId) => ({ lessonAlias, userId }));
export const progressForLesson = createAction(PROGRESS_FOR_LESSON, (lessonId, userId, passed) => ({ [userId]: { [lessonId]: passed } }));