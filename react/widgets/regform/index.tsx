import React, { useEffect, useState } from 'react';
import AuthForm from '../../components/AuthForm';
import { AxiosResponse } from 'axios';
import { serverRequest } from '../../functions';
import { storeTokens } from '../../tokens';
import '../../css/elements.css';

function RegForm({ title = 'Вход', successMessage = 'Ты зарегистрирован', backLink = '/auth', buttonTitle = undefined }) {

    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [codeId, setCodeId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (code.length === 6) {
            sendCode();
        }
    }, [code])

    async function sendEmail() {
        try {
            setError(null);
            setLoading(true);
            const { data }: AxiosResponse = await serverRequest('/api/auth/email', 'post', { email });
            setCodeId(data.id);
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    }

    async function sendCode() {
        if (code.length < 6) {
            return
        }
        try {
            setError(null);
            setLoading(true);
            const { data: { tokens: { accessToken, refreshToken, accessTokenExpired } } }: AxiosResponse = await serverRequest('/api/auth/subscribe', 'post', { id: codeId, code });
            storeTokens(accessToken, refreshToken, accessTokenExpired);
            setFinished(true);
            await serverRequest('/api/me', 'get');
        } catch (e) {
            setError(e.message);
        }
        setLoading(false);
    }

    if (finished) {
        return <div>{successMessage}</div>
    }

    return (
        <AuthForm
            loading={loading}
            me={undefined}
            from={undefined}
            setEmail={setEmail}
            email={email}
            code={code}
            sendEmail={sendEmail}
            sendCode={sendCode}
            setCode={setCode}
            error={error}
            codeId={codeId}
            setCodeId={setCodeId}
            title={title}
            backLink={backLink}
            buttonTitle={buttonTitle}
        />
    );
}

export default RegForm;