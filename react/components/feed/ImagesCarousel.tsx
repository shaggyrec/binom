import { SERVER_REQUESTS_BASE } from '../../functions';
import React from 'react';

function ImagesCarousel({ images }) {
    if (!images || images.length === 0) {
        return <hr className="post-hr"/>;
    }
    return (
        <div className={`post-images-post-images-carousel ${images.length === 1 ? 'one-image' : ''}`}>
            {images.map(image => (
                <a key={image} href={`${SERVER_REQUESTS_BASE}/file/${image}`} target="_blank" rel="noreferrer">
                    <img src={`${SERVER_REQUESTS_BASE}/file/${image}`} className="post-image-full" />
                </a>
            ))}
        </div>
    );
}
export default ImagesCarousel;