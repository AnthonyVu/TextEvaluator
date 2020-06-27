import React  from 'react';
import Dropzone from 'react-dropzone'
import fileService from './services/fileService'
import './App.css';


const Header = (props) => (
  <h2 className="header">Text Evaluator</h2>
)

function App() {
  const handleDrop = acceptedFiles => {
    const formData = new FormData();
    formData.append('file',acceptedFiles[0])
    fileService.uploadFile(formData).then(res => {
      console.log(res)
    });
  }
   

  return (
    <div className="App">
      <Header />
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Drag'n'drop files, or click to select files</p>
          </div>
        )}
      </Dropzone>
    </div>
  );
}

export default App;
