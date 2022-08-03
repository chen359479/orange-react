import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import '/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.css'

class EditorConvertToHTML extends Component {
    state = {
        editorState: EditorState.createEmpty(),
        content:""
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
            content:draftToHtml(convertToRaw(editorState.getCurrentContent()))
        });
    }

    render() {
        let { editorState } = this.state
        return (
            <div style={{ margin:"20px 10px 0 0" }}>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        );
    }

    // 渲染完成
    componentDidMount() {
        this.props.onRef(this);
    }
}

export default withRouter(EditorConvertToHTML)
