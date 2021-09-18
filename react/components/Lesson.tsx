import React, { ReactElement } from 'react';
import { Lesson } from '../dataTypes/lesson';
import Video from './Video';
import { SERVER_REQUESTS_BASE } from '../functions';
import Paddingable from './Paddingable';
import MathsText from './MathsText';
import YoutubeVideo from './YoutubeVideo';
import { FileIcon } from './Icons';
import { UserRole } from '../dataTypes/user';
import DemoUserMessage from './DemoUserMessage';

function renderTaskFiles(taskFiles, user): ReactElement {
    if (!taskFiles) {
        return null;
    }
    return (
        <Paddingable padding={[10, 0, 30]}>
            <DemoUserMessage user={user}/>
            {taskFiles.map((f, i) => (
                <div className="link-to-task" key={f} >
                    <a className="flex flex-vertical-centered" href={user.role !== UserRole.admin && !user.subscription ? undefined : `${SERVER_REQUESTS_BASE}/file/${f}`}
                        target="_blank" rel="noreferrer">
                        <FileIcon size={24} fill="#039151"/>&nbsp;
                        <span>Домашнее задание {taskFiles.length > 1 ? (i + 1) : ''}</span>
                    </a>
                </div>
            ))}
        </Paddingable>
    );
}

function Lesson(props: Lesson): ReactElement {
    return (
        <div>
            <div className="container">
                <h1>{props.name}</h1>
                {props.youtubeVideos && props.youtubeVideos.map((v, i) => (
                    <div key={v} style={{ marginTop: i > 0 ? 50 : 0 }}>
                        <YoutubeVideo video={v} />
                    </div>
                ))}
                {props.video && props.video.map(
                    (v, i) => (
                        <div key={v} className="video-container" style={{ marginTop: i > 0 ? 50 : 0 }}>
                            <Video src={SERVER_REQUESTS_BASE + '/file/' + v}/>
                        </div>
                    )
                )}
                <p className="text break-spaces">{props.text}</p>

                {(props.task || props.taskFiles) && (
                    <Paddingable padding={[10, 0]}>
                        <h2 className="mb-0">Домашнее задание</h2>
                        <h5 className="mt-0">Выполни домашнее задание, прикрепи его к форме ниже и нажми «отправить»</h5>
                        {props.task && (<MathsText>{props.task}</MathsText>)}
                        {renderTaskFiles(props.taskFiles, props.user)}
                    </Paddingable>
                )}
            </div>
        </div>
    );
}
export default Lesson;