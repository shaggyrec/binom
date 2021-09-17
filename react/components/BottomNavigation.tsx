import React, { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { Comments, Learning, Profile, Notification, StarIcon } from './Icons';

function BottomNavigation({ username, notificationsAmount }): ReactElement {
    return (
        <div className="bottom-menu">
            <div className="container">
                <footer>
                    <nav className="bottom-menu-nav">
                        <Link className="bottom-menu-nav-link transition3" to="/app"><Learning size={33}/></Link>
                        {/*<Link className="bottom-menu-nav-link transition3" to="/feed"><Comments /></Link>*/}
                        <Link className="bottom-menu-nav-link transition3" to="/rating"><StarIcon /></Link>
                        <Link className="bottom-menu-nav-link transition3" to="/notifications">
                            <Notification />
                            {notificationsAmount > 0 && <div className="bottom-menu-nav-link-badge">
                                <div className={`bottom-menu-nav-link-badge-content ${notificationsAmount > 99 ? 'bottom-menu-nav-link-badge-content-many' : ''}`}>
                                    {notificationsAmount < 100 ? notificationsAmount : '99+'}
                                </div>
                            </div>}
                        </Link>
                        <Link className="bottom-menu-nav-link transition3" to={`/@${username}`}><Profile /></Link>
                    </nav>
                </footer>
            </div>
        </div>
    );
}

export default BottomNavigation;