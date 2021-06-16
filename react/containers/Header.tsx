import React, {ReactElement} from 'react';
import { connect } from 'react-redux';


function Header(): ReactElement {
    return (
        <header>
            <div className="container">
                binom
            </div>
        </header>
    );
}

export default connect()(Header);