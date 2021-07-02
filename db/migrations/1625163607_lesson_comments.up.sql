CREATE TABLE IF NOT EXISTS lesson_comments (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     lesson_id uuid references lessons(id),
     user_id uuid references users(id),
     author uuid references users(id),
     text TEXT,
     created TIMESTAMP DEFAULT NOW(),
     updated TIMESTAMP
);


CREATE TABLE IF NOT EXISTS lesson_comment_files (
     id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
     lesson_comments_id uuid references lesson_comments(id) ON DELETE CASCADE,
     file_id uuid references files(id),
     created TIMESTAMP DEFAULT NOW()
);