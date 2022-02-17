CREATE TABLE IF NOT EXISTS questionnaires (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     name TEXT NOT NULL,
     created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     questionnaire_id uuid NOT NULL REFERENCES questionnaires(id),
     question TEXT NOT NULL,
     created TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS answers (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     question_id uuid NOT NULL REFERENCES questions(id),
     user_id uuid REFERENCES users(id),
     answer TEXT NOT NULL,
     created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO questionnaires (id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Опрос вебинар');
INSERT INTO questions (questionnaire_id, question) VALUES ('00000000-0000-0000-0000-000000000000', 'Знаешь ли ты какой-то «миф» о ЕГЭ, который бы хотел бы разобрать?');
INSERT INTO questions (questionnaire_id, question) VALUES ('00000000-0000-0000-0000-000000000000', 'Задай вопрос, который интересует.');