import React from 'react';

function UserBar({ user }) {
    return (
        <div className="userbar">
            <div className="userbar-avatar">{(user.name || user.username || user.email).charAt(0)}</div>
        </div>
    )
}

export default UserBar;