import React, {ReactElement} from 'react';
import { connect } from 'react-redux';
import Logo from '../components/Logo';


function Header(): ReactElement {
    return (
        <div className="container">
            <header>
                <Logo />
            </header>
        </div>
    );
}

export default connect()(Header);