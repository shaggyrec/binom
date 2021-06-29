import React, { ReactElement } from 'react';

function Video({ src }): ReactElement {
    return (
        <div className="video-container">
            <video src={src} controls controlsList="nodownload">
                Наши видео не работают в вашем браузере. Используйте пожалуйста последнюю версию Google Chrome
            </video>
        </div>
    );
}

export default Video;