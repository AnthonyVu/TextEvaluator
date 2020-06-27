import React, {useCallback}  from 'react';
import {useDropzone} from 'react-dropzone'
import './App.css';


const Header = (props) => (
  <h2 className="header">Text Evaluator</h2>
)

function MyDropzone() {
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
 
  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop a file here ...</p> :
          <p>Drag 'n' drop a file here, or click to select a file</p>
      }
    </div>
  )
}

function App() {
  return (
    <div>
      <Header />
      <MyDropzone />
    </div>
  );
}

export default App;
