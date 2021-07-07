import React, { ReactElement, useState } from 'react';
import { connect } from 'react-redux';
import Form from '../components/form/Form';
import Input from '../components/form/Input';
import Button from '../components/Button';
import Paddingable from '../components/Paddingable';
import Logo from '../components/Logo';
import { RootState } from '../Application';
import * as usersActions from '../ducks/users';
import Loader from '../components/Loader';

function CompleteProfile({ saveUserInfo, me, loading }): ReactElement {
    const [name, setName] = useState('');
    const [username, setUserName] = useState('');

    function handleSubmit() {
        saveUserInfo(me.id, { name, username });
    }

    function handleUsernameChange(newValue: string) {
        setUserName(newValue.replace(/[^a-z0-9_-]/, ''));
    }

    return (
        <>
            <div className="container">
                <header>
                    <div className="centered">
                        <Logo />
                    </div>
                </header>
                <Paddingable padding={[20, 0, 40]}>
                    <div className="w-600 centered">
                        <Form onSubmit={handleSubmit}>
                            <h2>Привет!</h2>
                            <Input label="Как тебя зовут?" value={name} onChange={setName} placeholder="Иван" required/>
                            <p>
                                <b>Username</b> - это уникальный в пределах сайта никнейм для идентификации и упоминаний.
                                Совсем как в Instagram.<br/>
                                Может содержать латинские символы, цифры, дефисы и подчеркивания.
                            </p>
                            <Input label="Username" value={username} onChange={handleUsernameChange} placeholder="ivan123" required/>
                            <Button block>Продолжить</Button>
                        </Form>
                    </div>
                </Paddingable>
            </div>
            <Loader show={loading}/>
        </>
    );
}

export default connect(
    (state: RootState) => ({
        me: state.users.me,
        error: state.users.error,
        errorCode: state.users.errorCode,
        loading: state.users.loading,
    }),
    dispatch => ({
        saveUserInfo: (id, data) => dispatch(usersActions.update(id, data))
    })
)(CompleteProfile);