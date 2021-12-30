import { connect } from 'react-redux';
import React, { ReactElement } from 'react';
import { RootState } from '../Application';
import { sendCode, sendEmail, setCode, setCodeId, setEmail } from '../ducks/auth';
import AuthForm from '../components/AuthForm';

function Auth(props): ReactElement {
    return (
        <div className="container w-600 py-20">
            <AuthForm {...props}/>
        </div>
    );
}

export default connect(
    (state: RootState) => ({
        me: state.users.me,
        from: state.auth.from,
        error: state.auth.error,
        email: state.auth.email,
        code: state.auth.code,
        codeId: state.auth.codeId,
        loading: state.auth.loading,
    }),
    dispatch => ({
        setEmail: email => dispatch(setEmail(email)),
        setCode: code => dispatch(setCode(code)),
        setCodeId: id => dispatch(setCodeId(id)),
        sendEmail: email => dispatch(sendEmail(email)),
        sendCode: code => dispatch(sendCode(code)),
    })
)(Auth);

