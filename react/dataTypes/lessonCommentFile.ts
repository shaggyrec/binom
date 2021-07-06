import { UploadedFile } from './file';

export interface LessonCommentFile {
    created: string
    file: UploadedFile
    fileId: string
    id: string
    lesson_comment: string
}