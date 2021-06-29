import React, { ReactElement } from 'react';
import { Lesson } from '../dataTypes/lesson';
import Video from './Video';
import { SERVER_REQUESTS_BASE } from '../functions';

function Lesson(props: Lesson): ReactElement {
    return (
        <div>
            <div className="container">
                <h1>{props.name}</h1>
            </div>
            {props.video && (
                <div className="video-container">
                    <div className="container">
                        <Video src={SERVER_REQUESTS_BASE + '/file/' + props.video}/>
                    </div>
                </div>
            )}
            <div className="container">
                <p>{props.text}</p>
            </div>
        </div>
    );
}
export default Lesson;