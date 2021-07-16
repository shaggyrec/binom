CREATE TABLE IF NOT EXISTS user_topics (
    user_id uuid NOT NULL references users(id),
    topic_id uuid NOT NULL references topics(id),
    lesson_id uuid NOT NULL references lessons(id),
    created TIMESTAMP DEFAULT NOW(),
    finished TIMESTAMP,
    UNIQUE (user_id, topic_id)
);

CREATE TABLE IF NOT EXISTS user_lessons (
    user_id uuid NOT NULL references users(id),
    lesson_id uuid NOT NULL references lessons(id),
    created TIMESTAMP DEFAULT NOW(),
    finished TIMESTAMP,
    UNIQUE (user_id, lesson_id)
);