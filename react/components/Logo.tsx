import React from 'react';

function Logo({ width = 120, height = 29 }) {
    return <div style={{ width, height }} className="logo"/>;
}

export default Logo;