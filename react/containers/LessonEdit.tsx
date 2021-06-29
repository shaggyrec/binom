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
import AdminBar from '../components/AdminBar';
import Modal from '../components/Modal';

function LessonEdit({ requestLesson, lesson, loading, match: { params }, updateLesson, requestTopics, topics, uploadFile,
                        uploadedFile, resetUploadedFile, removeFile, removedFile, resetURemovedFile }): ReactElement {
    const [showDeletingModal, setShowDeletingModal] = useState(false);

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
            updateLesson(lesson.id, { video: uploadedFile });
            resetUploadedFile();
        }
    }, [uploadedFile]);

    useEffect(() => {
        if (removedFile && removedFile === lesson.video) {
            requestLesson(lesson.alias);
            resetURemovedFile();
        }
    }, [removedFile])

    if (!lesson) {
        return <Loader />;
    }
    function handleSubmit(updated) {
        updateLesson(lesson.id, updated);
    }

    function handleDeleteVideo() {
        lesson.video && removeFile(lesson.video);
        setShowDeletingModal(false);
    }
    return (
        <>
            <AdminBar>
                <Link to={`/lesson/${params.alias}`}>
                    <Back size={25}/>
                </Link>
            </AdminBar>
            <div className="w-600 centered">
                <LessonEditForm
                    {...lesson}
                    topics={topics}
                    onSubmit={handleSubmit}
                    onFileUpload={uploadFile}
                    loading={loading}
                    onClickDeleteVideo={() => setShowDeletingModal(true)}
                />
            </div>
            {showDeletingModal && <Modal onClickOk={handleDeleteVideo} onClickCancel={() => setShowDeletingModal(false)}>Уверены, что хотите удалить видео?</Modal>}
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