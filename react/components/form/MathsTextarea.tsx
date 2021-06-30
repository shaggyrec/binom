import React from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import '@uiw/react-md-editor/dist/markdown-editor.css'
import katex from 'katex';
import 'katex/dist/katex.css';
import '../../css/math-editor.css';

// TODO code splitting https://parceljs.org/code_splitting.html

export const previewOptions: any = {
    components: {
        code: ({ inline, children, className }) => {
            const txt = children[0] || '';
            if (inline) {
                if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                    const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                        throwOnError: false,
                    });
                    return <code dangerouslySetInnerHTML={{ __html: html }} />;
                }
                return <code>{txt}</code>;
            }
            if (
                typeof txt === 'string' &&
                typeof className === 'string' &&
                /^language-katex/.test(className.toLocaleLowerCase())
            ) {
                const html = katex.renderToString(txt, {
                    throwOnError: false,
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} />;
            }
            return <code className={String(className)}>{txt}</code>;
        },
    },
};

function MathsTextarea({ label, value, onChange }) {
    return (
        <div>
            <div>
                <label>
                    <span className="input-label text">{label}</span>
                </label>
                <MDEditor
                    value={value}
                    onChange={onChange}
                    previewOptions={previewOptions}
                    commands={[commands.bold, commands.italic]}
                />
            </div>
        </div>
    );
}

export default MathsTextarea;