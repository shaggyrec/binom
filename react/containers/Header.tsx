import React, { ReactElement } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Logo from '../components/Logo';
import { RootState } from '../Application';
import Button from '../components/Button';
import { Back } from '../components/Icons';
import { BackLink } from '../dataTypes/backLink';
import { backLink } from '../ducks/application';
import Instruction from '../components/Instruction';

function renderBackLink(backLink: BackLink|null, reset) {
    const handleClick = (e) => {
        backLink.onClick(e);
        reset();
    }
    if (!backLink) {
        return null;
    }
    return (
        <Link className="back-link" to={backLink.url} onClick={handleClick}>
            <Back size={15}/>
        </Link>
    );
}


function Header({ backLink, resetBackLink, username }): ReactElement {
    return (
        <div className="container">
            <header>
                <div className="flex flex-vertical-initial">
                    {renderBackLink(backLink, resetBackLink)}
                    <Logo />
                </div>
                <Instruction username={username}/>
            </header>
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        backLink: state.application.backLink,
        username: state.users?.me?.username
    }),
    dispatch => ({
        resetBackLink: () => dispatch(backLink(null)),
    })
)(Header);