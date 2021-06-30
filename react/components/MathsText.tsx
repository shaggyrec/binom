import MDEditor from '@uiw/react-md-editor';
import React, { ReactElement } from 'react';
import { previewOptions } from './form/MathsTextarea';

function MathsText({ children }): ReactElement {
    return <MDEditor.Markdown source={children} {...previewOptions}/>;
}

export default MathsText;