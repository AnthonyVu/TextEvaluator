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
  const history = useHistory()
  if (Object.keys(words).length === 0) {
    return (
      <div>
        <p>Empty</p>
        <button onClick={() => history.push('/')}>back</button>
      </div>
      
    )
  }
  return (
    <div>
      <button onClick={() => history.push('/')}>back</button>
      <h1>Nouns</h1>
      {Object.keys(words.nouns).map((key, i) => {
        return <p key={i}>{key}, {words.nouns[key]}</p>
      })}
      <h1>Adjectives</h1>
      {Object.keys(words.adjectives).map((key, i) => {
        return <p key={i}>{key}, {words.adjectives[key]}</p>
      })}
      <h1>Verbs</h1>
      {Object.keys(words.verbs).map((key, i) => {
        return <p key={i}>{key}, {words.verbs[key]}</p>
      })}
      <h1>Adverbs</h1>
      {Object.keys(words.adverbs).map((key, i) => {
        return <p key={i}>{key}, {words.adverbs[key]}</p>
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
