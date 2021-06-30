import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Gear, Learning, Profile } from './Icons';

function BottomNavigation({ isAdmin }): ReactElement {
    return (
        <div className="bottom-menu">
            <div className="container">
                <footer>
                    <nav className="bottom-menu-nav">
                        <Link className="bottom-menu-nav-link transition3" to="/app"><Learning /></Link>
                        <Link className="bottom-menu-nav-link transition3" to="/me"><Profile /></Link>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

export default BottomNavigation;