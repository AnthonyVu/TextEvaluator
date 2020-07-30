import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { TagCloud } from 'react-tagcloud'
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
    if(acceptedFiles[0].type !== "application/pdf" 
      && acceptedFiles[0].type !== "plain/text" 
      && acceptedFiles[0].type !== "application/msword" 
      && acceptedFiles[0].type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        alert("wrong file type, only pdfs, txt, doc, and docs files work!")
        return
      }
    const formData = new FormData();
    formData.append('file',acceptedFiles[0])
    fileService.uploadFile(formData).then(res => {
      setWords(res)
      history.push('/evaluation')
    });
  }

  return (
    <div className="dropzone">
      <Dropzone onDrop={handleDrop}>
      {({ getRootProps, getInputProps }) => (
        <div {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()}/>
          <p>Drag'n'drop a file, or click to select a file</p>
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

  var data = []
  Object.keys(words.merged).map(key => {
    data.push({value: key, count: words.merged[key]})
  })
  // Object.keys(words.adjectives).map(key => {
  //   data.push({value: key, count: words.adjectives[key]})
  // })
  // Object.keys(words.verbs).map(key => {
  //   data.push({value: key, count: words.verbs[key]})
  // })
  // Object.keys(words.adverbs).map(key => {
  //   data.push({value: key, count: words.adverbs[key]})
  // })
  return (
    <div>
      <h1>Word Cloud</h1>
      <TagCloud
        minSize={12}
        maxSize={50}
        tags={data}
      />
      <button onClick={() => history.push('/')}>back</button>
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
