import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import ReactWordcloud from 'react-wordcloud'
import fileService from './services/fileService'
import fileImg from './file.png'
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

const File = ({file, files, setFiles}) => {
  const deleteFile = () => {
    const newFiles = files.filter(curr => curr.name !== file.name)
    setFiles(newFiles)
  }
  return (
    <div>
      <p><img src={fileImg} alt="logo"></img> {file.name} <button onClick={deleteFile}>x</button></p>
    </div>
  )
}

const BackButton = ({files, onClick}) => {
  if(files.length === 0) {
    return (<button disabled={true}>Evaluate</button>)
  }
  return (
    <button onClick={onClick}>Evaluate</button>
  )
}

const Home = ({ setWords, files, setFiles }) => {
  const history = useHistory()
  const formData = new FormData();
  const handleDrop = acceptedFiles => {
    if(acceptedFiles[0].type !== "application/pdf" 
    && acceptedFiles[0].type !== "text/plain" 
    && acceptedFiles[0].type !== "application/msword" 
    && acceptedFiles[0].type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      alert("wrong file type, only pdfs, txt, doc, and docs files work!")
      return
    }
    if(files.length === 5) {
      alert("Maximum of 5 files!")
    } else if (files.filter(file => file.name === acceptedFiles[0].name).length > 0){ 
      alert("file already added!")
    } else {
      const newFiles = files.concat(acceptedFiles[0])
      setFiles(newFiles)
    }
  }

  const evaluate = () => {
    files.forEach(file => {
      formData.append('file',file)
    })
    fileService.uploadFile(formData).then(res => {
      setWords(res)
      history.push('/evaluation')
    });
  }

  return (
    <div>
      <Dropzone 
        onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()}/>
            <p>Drag'n'drop a file, or click to select a file.</p>
          </div>
        )}
      </Dropzone>
      <BackButton files={files} onClick={evaluate}/>
      {files.map((file,i) => 
        <File key={i} file={file} files={files} setFiles={setFiles} />
      )}
    </div>
  )
}

const Evaluation = ({ words, setFiles }) => {
  const history = useHistory()
  const reset = () => {
    history.push('/')
    setFiles([])
  }
  if (Object.keys(words).length === 0) {
    return (
      <div >
        <p>Empty</p>
        <button onClick={reset}>back</button>
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
        <button onClick={reset}>back</button>
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
  const [files, setFiles] = useState([]);
  return (
    <div className="App">
      <Header />
      <Router>
        <Switch>
          <Route path="/evaluation">
            <Evaluation words={words} setFiles={setFiles}/>
          </Route>
          <Route path="/">
            <Home setWords={setWords} files={files} setFiles={setFiles}/>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
