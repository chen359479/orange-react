import { useState , useEffect , useContext } from 'react';
import { EditorState, convertToRaw , Modifier  } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';

import '/node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './styles.css'

import MyContext from "../MyContext/MyContext";

export default ()=>{

    const [ editorState , setEditorState ] = useState(EditorState.createEmpty())
    const [ content , setContent ] = useState('')

    // 接收父组件抛出值
    const { initialValue , reEditorChange } = useContext(MyContext)

    let onEditorStateChange = (editorState) => {
        setEditorState(editorState);
        setContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
    }

    useEffect(()=>{
       if(!content.length){
           const newContentState = Modifier.insertText(
               editorState.getCurrentContent(),
               editorState.getSelection(),
               initialValue,
           );
           setEditorState(
               EditorState.push(editorState, newContentState, 'insert-characters')
           )
       }
    },[ initialValue ])

    useEffect(()=>{
        reEditorChange( content )
    },[ content ])

    return (
        <div style={{ margin:"20px 10px 0 0" }}>
            <Editor
                editorState={ editorState }
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={ onEditorStateChange }
            />
        </div>
    );
}
