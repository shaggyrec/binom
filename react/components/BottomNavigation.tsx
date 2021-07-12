import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Comments, Learning, Profile } from './Icons';

function BottomNavigation({ username }): ReactElement {
    return (
        <div className="bottom-menu">
            <div className="container">
                <footer>
                    <nav className="bottom-menu-nav">
                        <Link className="bottom-menu-nav-link transition3" to="/app"><Learning /></Link>
                        <Link className="bottom-menu-nav-link transition3" to="/feed"><Comments /></Link>
                        <Link className="bottom-menu-nav-link transition3" to={`/@${username}`}><Profile /></Link>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

export default BottomNavigation;