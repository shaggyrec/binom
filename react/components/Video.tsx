import React, { ReactElement } from 'react';

function Video({ src }): ReactElement {
    return (
        <video src={src} controls controlsList="nodownload">
            Наши видео не работают в вашем браузере. Используйте пожалуйста последнюю версию Google Chrome
        </video>
    );
}

export default Video;