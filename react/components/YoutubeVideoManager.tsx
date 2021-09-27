import React, { ReactElement, useState } from 'react';
import Input from './form/Input';
import Button from './Button';
import { Bin } from './Icons';
import YoutubeVideo from './YoutubeVideo';

function YoutubeVideoManager({ videos, onChange }): ReactElement {
    const [newVideo, setNewVideo] = useState('')
    function handleAdd() {
        if (newVideo.length > 0) {
            onChange([...videos, newVideo.replace('https://youtu.be/', '')]);
        }
    }
    function handleDelete(i) {
        onChange([...videos.slice(0, i), ...videos.slice(i + 1)]);
    }
    return (
        <div style={{ paddingBottom: 30 }}>
            <h4>Видео youtube</h4>
            {videos && videos.map((v, i) => (
                <div className="py-10" key={`youtube-video-${i}`}>
                    <YoutubeVideo video={v} />
                    <Button red small onClick={() => handleDelete(i)}><Bin fill="#fff" size={15} /> Удалить</Button>
                </div>
            ))}
            <div className="flex flex-vertical-centered gap-20">
                <div className="w-100">
                    <Input
                        placeholder="Ссылка на youtube.com"
                        label="Добавить видео"
                        value={newVideo}
                        onChange={setNewVideo}
                    />
                </div>
                <Button onClick={handleAdd}>Добавить</Button>
            </div>
        </div>
    );
}

export default YoutubeVideoManager;