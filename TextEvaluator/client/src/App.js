import React, { useState } from 'react';
import Dropzone from 'react-dropzone'
import fileService from './services/fileService'
import './App.css';
import {
  BrowserRouter as Router,
  Switch, Route, useHistory
} from "react-router-dom"

const Header = (props) => (
  <h2 className="header">Text Evaluator</h2>
)
const Home = ({ setWords }) => {
  const history = useHistory()

  const handleDrop = acceptedFiles => {
    const formData = new FormData();
    formData.append('file',acceptedFiles[0])
    fileService.uploadFile(formData).then(res => {
      setWords(res)
      history.push('/evaluation')
    });
  }

  return (
    <div>
      <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          <p>Drag'n'drop files, or click to select files</p>
        </div>
      )}
    </Dropzone>
    </div>
  )
}

const Evaluation = ({ words }) => {
  return (
    <div>
      {Object.keys(words).map((key, i) => {
        return <p key={i}>{key}</p>
      })}
    </div>
  )

}

function App() {
  
  const [words, setWords] = useState({});

  return (
    <div className="App">
      <Header />
      <Router>
        <Switch>
          <Route path="/evaluation">
            <Evaluation words={words}/>
          </Route>
          <Route path="/">
            <Home setWords={setWords}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
