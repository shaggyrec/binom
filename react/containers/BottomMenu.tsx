import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../Application';
import { Learning, Profile } from '../components/Icons';

function BottomMenu({ me }): ReactElement {
    if (!me) {
        return null;
    }
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
export default connect(
    (state: RootState) => ({
        me: state.users.me,
    })
)(BottomMenu);