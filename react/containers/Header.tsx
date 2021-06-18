import React, {ReactElement} from 'react';
import { connect } from 'react-redux';
import Logo from '../components/Logo';


function Header(): ReactElement {
    return (
        <header>
            <Logo />
        </header>
    );
}

export default connect()(Header);