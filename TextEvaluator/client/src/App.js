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
  const formData = new FormData();
  const handleDrop = acceptedFiles => {
    acceptedFiles.forEach((file) => {
      if(file.type !== "application/pdf" 
      && file.type !== "text/plain" 
      && file.type !== "application/msword" 
      && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        alert("wrong file type, only pdfs, txt, doc, and docs files work!")
        return
      }
    console.log(file)
    formData.append('file',file)
    })
  }

  const evaluate = () => {
    fileService.uploadFile(formData).then(res => {
      setWords(res)
      history.push('/evaluation')
    });
  }

  return (
    <div>
      <Dropzone 
        maxFiles={5}
        multiple={true} 
        onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()}/>
            <p>Drag'n'drop a file, or click to select a file</p>
          </div>
        )}
      </Dropzone>
      <button onClick={evaluate}>Evaluate</button>
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
    nouns.push({text: key, count: words.nouns[key]})
  })
  Object.keys(words.adjectives).map(key => {
    adjectives.push({text: key, count: words.adjectives[key]})
  })
  Object.keys(words.verbs).map(key => {
    verbs.push({text: key, count: words.verbs[key]})
  })
  Object.keys(words.adverbs).map(key => {
    adverbs.push({text: key, count: words.adverbs[key]})
  })
  return (
    <div>
      <div>
        <div style={{ height: '300px', width: '100%' }}>
          <ReactWordcloud options={options} words={mergedData} />
        </div>
      </div>
      <div style={{textAlign:'right', float:'right'}}>
        <button onClick={() => history.push('/')}>back</button>
      </div>
      <div className="chartContainer">
        <ChartData label="Nouns" data={nouns} color="#8884d8"/>
        <ChartData label="Adjectives" data={adjectives} color="#82ca9d"/>
        <ChartData label="Verbs" data={verbs} color="#ffce48"/>
        <ChartData label="Adverbs" data={adverbs} color="#ff5555"/>
      </div>
    </div>
  )
}

const ChartData = ({label, data, color}) => {
  return (
    <div className="charts">
      <h1>{label}</h1>
      <ResponsiveContainer height='100%' width='100%'>
        <BarChart
          data={data}
          margin={{top: 5, right: 30, left: 20, bottom: 5}}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="text"/>
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill={color} />
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
