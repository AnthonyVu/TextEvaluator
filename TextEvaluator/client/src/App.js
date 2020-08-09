import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import ReactWordcloud from 'react-wordcloud';
import fileService from './services/fileService'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
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
    console.log(acceptedFiles[0])
    if(acceptedFiles[0].type !== "application/pdf" 
      && acceptedFiles[0].type !== "text/plain" 
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
    <div>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone" {...getRootProps()}>
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
      <div >
        <p>Empty</p>
        <button onClick={() => history.push('/')}>back</button>
      </div>
      
    )
  }

  const options = {
    fontSizes: [12, 60],
  }
  
  var mergedData = []
  var nouns = []
  var adjectives = []
  var verbs = []
  var adverbs = []
  Object.keys(words.merged).map(key => {
    mergedData.push({text: key, value: words.merged[key]})
  })
  Object.keys(words.nouns).map(key => {
    nouns.push({text: key, value: words.nouns[key]})
  })
  Object.keys(words.adjectives).map(key => {
    adjectives.push({text: key, value: words.adjectives[key]})
  })
  Object.keys(words.verbs).map(key => {
    verbs.push({text: key, value: words.verbs[key]})
  })
  Object.keys(words.adverbs).map(key => {
    adverbs.push({text: key, value: words.adverbs[key]})
  })
  return (
    <div>
      <div>
        <div style={{ height: '300px', width: '100%' }}>
          <ReactWordcloud options={options} words={mergedData} />
        </div>
      </div>
      <div style={{textAlign:'right', float:'right'}}>
        <p style={{color:'#acaaaa', margin:'0px 10px 10px 10px', fontSize:'12px'}}>Word cloud of all nouns, adjectives, verbs, and adverbs</p>
        <button onClick={() => history.push('/')}>back</button>
      </div>
      <div className="container">
        <div className="box"><ChartData label="Nouns" data={nouns} color="#8884d8"/></div>
        <div className="box"><ChartData label="Adjectives" data={adjectives} color="#82ca9d"/></div>
        <div className="box"><ChartData label="Verbs" data={verbs} color="#ffce48"/></div>
        <div className="box"><ChartData label="Adverbs" data={adverbs} color="#ff5555"/></div>
      </div>
    </div>
  )
}

const ChartData = ({label, data, color}) => {
  return (
    <div className="charts">
      <h1>Top 10 Most-used {label}</h1>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart
          data={data.slice(0,10)}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="text"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={color} />
        </BarChart>
      </ResponsiveContainer>
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
