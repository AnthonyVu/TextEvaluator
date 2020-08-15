import React, { useState, useEffect } from 'react'

import './App.css'
import {
  BrowserRouter as Router,
  Switch, Route
} from "react-router-dom"

import Header from './components/Header'
import About from './components/About'
import Home from './components/Home'
import Evaluation from './components/Evaluation'

function App() {
  const [words, setWords] = useState({});
  const [files, setFiles] = useState([]);
  useEffect(() => {
    const savedEvaluation = window.localStorage.getItem('processedData')
    if (savedEvaluation) {
      const res = JSON.parse(savedEvaluation)
      setWords(res)
    }
  }, [])

  return (
    <div className="App">
        <Router>
        <Header setFiles={setFiles} words={words} />
        <div className="content">
          <Switch>
            <Route path="/evaluation">
              <Evaluation words={words} setFiles={setFiles}/>
            </Route>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/">
              <Home setWords={setWords} files={files} setFiles={setFiles}/>
            </Route>
          </Switch>
        </div>
        </Router>
    </div>
  );
}

export default App;
