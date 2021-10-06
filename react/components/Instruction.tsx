import React, { ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';
import { Close, InfoIcon } from './Icons';
import Button from './Button';

function renderInstruction(show, username, toggle) {
    if (!show) {
        return null
    }
    return (
        <div className="instruction">
            <div className="container centered w-600 py-20">
                <div className="text-right">
                    <Button small className="inline-flex" onClick={toggle}>
                        <Close size={24} />
                    </Button>
                </div>
                <h1>Как готовиться к ЕГЭ на binom.school</h1>
                <p>
                    В демо-версии доступны 2 первые темы. Не доступны домашние задания. И преподаватель не будет отвечать на вопросы.<br/>
                    Чтобы оформить подписку нажми <Link to={`/@${username}`}>на ссылку или перейди в раздел "Профиль"</Link>
                </p>
                <img className="max-w-100 neomorphic" src="/instruction/1.png"/>
                <p>
                    Чтобы начать заниматься, нажми кнопку "Начать".<br/>
                </p>
                <p>
                    Ты попадешь в урок. Посмотри видео по теме. Их может быть одно или два.
                </p>
                <img className="max-w-100 neomorphic" src="/instruction/2.png"/>
                <p>
                    После просмотра видео и изучения темы, спустись ниже. Там будет файл с домашним заданием.<br/>
                    Открой его и выполни в тетради или на листочке.
                </p>
                <img className="max-w-100 neomorphic" src="/instruction/3.png"/>
                <p>
                    Сфотографируй и прикрепи фото, нажав на символ скрепки либо перетащи в поле ввода.<br/>
                    Если что-то непонятно или есть вопрос, можно задать его введя в текстовое поле.<br/>
                    Можно сначала задать вопрос, а потом прикрепить домашнее задание. Преподаватель ответит,
                    но так как проверять будет нечего, зачёт пока не поставит. Вернётся к этому, когда ты прикрепишь
                    файл с домашней работой
                </p>
                <img className="max-w-100 neomorphic" src="/instruction/4.png"/>
                <p>
                    Так будет выглядеть твой комментарий и/или прикрепленный файл с домашней работой
                </p>
                <img className="max-w-100 neomorphic" src="/instruction/5.png"/>
                <p>
                    Следующий урок откроется только после того, как будет проверено твоё домашнее задание.
                    Так, двигаясь по плану, ты изучишь все темы и подготовишься к ЕГЭ.<br/>
                    Информация о том, что твоё задание проверили и ты можешь переходить к следующему уроку, придёт тебе на email.
                    Также оповещение появится на странице оповещений. Страница открывается, если нажать колокольчик в нижнем меню.
                </p>
                <p>
                    Когда ты заходишь на binom.school, у тебя открывается тема, которую ты сейчас проходишь.
                    Она помечена красной иконкой песочных часов со стрелочкой вокруг них.<br/>
                    Пройденные темы помечаются зелёной галочкой и значком "Зачёт"<br/>
                    Подобная маркировка и уроков. Зелёная галочка означает, что урок пройден.
                    Красная стрелочка - это твой текущий урок, который нужно пройти или который проверяется.<br/>
                    Символ замка означает заблокированные уроки и темы. Они будут открываться по мере прохождения курса.
                </p>
                <img className="max-w-100 neomorphic" src="/instruction/6.png"/>
                <p>
                    Чем лучше ты выполнил домашнее задание, тем больше баллов ты за него получишь. Баллы учитывают в общем рейтинге.
                    Текущее положение можно увидеть, если нажать на звёздочку в нижнем меню.<br/>
                    Тот, кто наберёт больше всех баллов за сезон подготовки  и получит за ЕГЭ "отлично",
                    получит назад все потраченные на binom.school деньги.
                </p>
                <h4>Удачи! Стране нужны "стобальники"!</h4>
            </div>
        </div>
    );
}

function Instruction({ username }): ReactElement {
    const [show, setShow] = useState(false)
    function toggle() {
        setShow(!show)
    }
    return (
        <>
            <div className="flex flex-vertical-centered pointer gap-5 instruction-button" onClick={toggle}>
                <i className="text-xs text">Инструкция</i>
                <InfoIcon size={24}/>
            </div>
            {renderInstruction(show, username, toggle)}
        </>
    );
}

export default Instruction