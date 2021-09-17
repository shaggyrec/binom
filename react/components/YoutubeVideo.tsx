import React, { ReactElement } from 'react';

function YoutubeVideo({ video }): ReactElement {
    return (
        <iframe
            className="youtube-video"
            src={video.indexOf('https://') !== -1 ? video : `https://www.youtube.com/embed/${video}?modestbranding=1`}
            frameBorder="0" allowFullScreen
        />
    );
}

export default YoutubeVideo;