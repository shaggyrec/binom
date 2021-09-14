import { connect } from 'react-redux';
import React, { ReactElement, useEffect, useState } from 'react';
import { RootState } from '../Application';
import { Redirect } from 'react-router';
import Form from '../components/form/Form';
import Input from '../components/form/Input';
import Button from '../components/Button';
import { sendCode, sendEmail, setCode, setCodeId, setEmail } from '../ducks/auth';
import CodeInput from '../components/form/CodeInput';
import useQueryString from '../hooks/useQueryString';
import Loader from '../components/Loader';

function Auth({ me, from, setEmail, email, code, sendEmail, sendCode, setCode, error, codeId, history, setCodeId, loading }): ReactElement {
    const [formError, setFormError] = useState(error);
    const queryString = useQueryString();

    useEffect(() => {
        if (queryString.has('id') && queryString.has('code')) {
            setCodeId(queryString.get('id'));
            setCode(queryString.get('code'));
        }
    } ,[]);

    useEffect(() => {
        if (me) {
            history.push(from);
        }
    }, [me]);

    if (me) {
        return <Redirect to={from} />
    }

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
            <h3 className="mt-0">Введите {codeId ? `код, отправленный на ${email || 'email'}` :'email'}</h3>
            <Form onSubmit={handleSubmit}>
                {
                    codeId
                        ? <CodeInput error={formError} value={code || ''} onChange={handleCodeChange}/>
                        : <Input required={true} name="email" type="email" value={email || ''} label="Email" onChange={setEmail}/>
                }

                {!codeId && !loading && <Button className="block">Войти</Button>}
            </Form>
            <Loader show={loading} />
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

