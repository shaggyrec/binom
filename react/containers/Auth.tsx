import { connect } from 'react-redux';
import React, { ReactElement, useEffect, useState } from 'react';
import { RootState } from '../Application';
import { Redirect } from 'react-router';
import Form from '../components/form/Form';
import Input from '../components/form/Input';
import Button from '../components/Button';
import { sendCode, sendEmail, setCode, setEmail } from '../ducks/auth';
import CodeInput from '../components/form/CodeInput';

function Auth({ me, from, setEmail, email, code, sendEmail, sendCode, setCode, error, codeId, history }): ReactElement {
    const [formError, setFormError] = useState(error);

    if (me) {
        return <Redirect to={from} />
    }

    useEffect(() => {
        console.log(me)
        if (me) {
            history.push(from);
        }
    });

    const handleSubmit = () => {
        if (codeId) {
            if (code.length !== 6) {
                setFormError('Неверный код');
                return;
            }
            sendCode();
            return;
        }
        sendEmail();
    }

    const handleCodeChange = (code) => {
        setCode(code);
        if (code.length === 6) {
            sendCode();
        }
    }

    return (
        <div className="container w-600 py-20">
            <h1 className="mb-0">Вход</h1>
            <h3 className="mt-0">Введите {codeId ? `код, отправленный на ${email}` :'email'}</h3>
            <Form onSubmit={handleSubmit}>
                {
                    codeId
                        ? <CodeInput error={formError} value={code || ''} onChange={handleCodeChange}/>
                        : <Input required={true} name="email" type="email" value={email || ''} label="Email" onChange={setEmail}/>
                }

                {!codeId && <Button className="block">Войти</Button>}
            </Form>
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
    }),
    dispatch => ({
        setEmail: email => dispatch(setEmail(email)),
        setCode: code => dispatch(setCode(code)),
        sendEmail: email => dispatch(sendEmail(email)),
        sendCode: code => dispatch(sendCode(code)),
    })
)(Auth);

