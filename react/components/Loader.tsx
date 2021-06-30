import React from 'react';

function Loader({ show = true }) {
    return show ? <div className="overlay"><div className="loader"><div className="loader-image" /></div></div> : null;
}

export default Loader;