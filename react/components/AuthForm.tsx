import React, { ReactElement, useEffect, useState } from 'react';
import { Redirect } from 'react-router';
import useQueryString from '../hooks/useQueryString';
import Form from './form/Form';
import CodeInput from './form/CodeInput';
import Input from './form/Input';
import Button from './Button';
import Paddingable from './Paddingable';
import { Back } from './Icons';
import Loader from './Loader';

function AuthForm({
    me, from, setEmail, email, code, sendEmail, sendCode, setCode, error, codeId, history = undefined,
    setCodeId, loading, title = 'Вxoд', backLink = '/auth', buttonTitle = 'Войти'
}): ReactElement {
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
        <>
            <h1 className="mb-0">{title}</h1>
            <h3 className="mt-0">Введите {codeId ? `код, отправленный на ${email || 'email'}` :'email'}</h3>
            <Form onSubmit={handleSubmit}>
                {
                    codeId
                        ? <CodeInput error={formError} value={code || ''} onChange={handleCodeChange}/>
                        : <Input required={true} name="email" type="email" value={email || ''} label="Email" onChange={setEmail}/>
                }
                <div style={{ marginTop: -20 }}/>
                {error && <div className="text-red">{ error }</div>}
                {!codeId && !loading && (
                    <>
                        <div style={{ paddingBottom: 10 }}>
                            <a href="/privacy" target="_blank">
                                <small>
                                    Нажимая кнопку, я соглашаюсь с политикой конфиденциальности и обработкой персональных данных
                                </small>
                            </a>
                        </div>
                        <Button className="block">{buttonTitle}</Button>
                    </>
                )}
            </Form>
            {codeId &&
            <Paddingable padding={[40, 0]}>
                <a href={backLink}><div style={{ display: 'inline-block' }}><Back size={15} fill="#039151"/></div> Ввести email заново</a>
            </Paddingable>
            }
            <Loader show={loading} />
        </>
    );
}

export default AuthForm;