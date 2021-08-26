import { connect } from 'react-redux';
import { RootState } from '../Application';
import * as lessonsActions from '../ducks/lessons';
import * as topicsActions from '../ducks/topics';
import * as filesActions from '../ducks/files';
import React, { ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import LessonEditForm from '../components/LessonEditForm';
import { Back } from '../components/Icons';
import TopBar from '../components/TopBar';
import Modal from '../components/Modal';

const WAITING_VIDEO = 'WAITING_VIDEO';
const WAITING_TASK = 'WAITING_TASK';

function LessonEdit({ requestLesson, lesson, loading, match: { params }, updateLesson, requestTopics, topics, uploadFile,
    uploadedFile, resetUploadedFile, removeFile, removedFile, resetURemovedFile }): ReactElement {
    const [showDeletingModal, setShowDeletingModal] = useState(false);
    const [waitFile, setWaitFile] = useState(null);

    useEffect(() => {
        if (!lesson) {
            requestLesson(params.alias);
        }
        if (topics.length === 0) {
            requestTopics();
        }
    }, [])
    useEffect(() => {
        if (uploadedFile) {
            if (waitFile === WAITING_VIDEO) {
                updateLesson(lesson.id, { video: [...(lesson.video || []), uploadedFile] });
            }
            if (waitFile === WAITING_TASK) {
                updateLesson(lesson.id, { taskFiles: [...(lesson.taskFiles || []), uploadedFile] });
            }
            setWaitFile(null);
            resetUploadedFile();
        }
    }, [uploadedFile]);

    useEffect(() => {
        if (removedFile && lesson.video && (lesson.video.indexOf(removedFile) !== -1 || lesson.taskFiles.indexOf(removedFile) !== -1)) {
            requestLesson(lesson.alias);
            const indexOfFile = lesson.video.indexOf(removedFile) !== -1  ? lesson.video.indexOf(removedFile) : lesson.taskFiles.indexOf(removedFile);
            if (lesson.video.indexOf(removedFile) !== -1) {
                updateLesson(lesson.id, { video: [...lesson.video.slice(0, indexOfFile), ...lesson.video.slice(indexOfFile + 1)] });
            } else {
                updateLesson(lesson.id, { taskFiles: [...lesson.taskFiles.slice(0, indexOfFile), ...lesson.taskFiles.slice(indexOfFile + 1)] });
            }
            resetURemovedFile();
        }
    }, [removedFile])

    if (!lesson) {
        return <Loader />;
    }
    function handleSubmit(updated) {
        updateLesson(lesson.id, updated);
    }

    function handleDeleteFile() {
        lesson.video && (lesson.video.indexOf(showDeletingModal) !== -1 || lesson.taskFiles.indexOf(showDeletingModal) !== -1) && removeFile(showDeletingModal);
        setShowDeletingModal(false);
    }

    function handleUploadVideo(f) {
        setWaitFile(WAITING_VIDEO);
        uploadFile(f);
    }

    function handleUploadTask(f) {
        setWaitFile(WAITING_TASK);
        uploadFile(f);
    }
    return (
        <>
            <TopBar>
                <Link to={`/lesson/${params.alias}`}>
                    <Back size={25}/>
                </Link>
            </TopBar>
            <div className="w-600 centered">
                <LessonEditForm
                    {...lesson}
                    topics={topics}
                    onSubmit={handleSubmit}
                    onVidelUpload={handleUploadVideo}
                    onTaskUpload={handleUploadTask}
                    loading={loading}
                    onClickDeleteFile={(id) => setShowDeletingModal(id)}
                />
            </div>
            {showDeletingModal && <Modal onClickOk={handleDeleteFile} onClickCancel={() => setShowDeletingModal(false)}>Уверены, что хотите удалить файл?</Modal>}
            <Loader show={loading}/>
        </>
    );
}
export default connect(
    (state: RootState) => ({
        lesson: state.lessons.current,
        topics: state.topics.list.map(c => ({ value: c.id, title: c.name })),
        loading: state.lessons.loading || state.files.loading,
        uploadedFile: state.files.lastUploadedFile,
        removedFile: state.files.lastRemovedFile,
    }),
    dispatch => ({
        requestLesson: alias => dispatch(lessonsActions.request(alias)),
        requestTopics: () => dispatch(topicsActions.requestList()),
        updateLesson: (id, updated) => dispatch(lessonsActions.update(id, updated)),
        uploadFile: file => dispatch(filesActions.upload(file)),
        resetUploadedFile: () => dispatch(filesActions.lastUploadedFile(null)),
        resetURemovedFile: () => dispatch(filesActions.lastRemovedFile(null)),
        removeFile: id => dispatch(filesActions.remove(id)),
    })
)(LessonEdit)