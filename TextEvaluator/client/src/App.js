import React, { useState, useEffect } from 'react'
import Dropzone from 'react-dropzone'
import ReactWordcloud from 'react-wordcloud'
import fileService from './services/fileService'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import './App.css'
import {
  BrowserRouter as Router,
  Switch, Route, useHistory
} from "react-router-dom"
import LoadingScreen from 'react-loading-screen'
import HomeOutlined from '@material-ui/icons/HomeOutlined'
import InfoOutlined from '@material-ui/icons/InfoOutlined'
import DoneOutlined from '@material-ui/icons/DoneOutlined'
import DeleteOutlined from '@material-ui/icons/DeleteOutlined'
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined'
import CreateOutlined from '@material-ui/icons/CreateOutlined'
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp'

const Header = ({setFiles, words}) => {
  const history = useHistory()
  const reset = () => {
    history.push('/')
    setFiles([])
  }

  const resetAbout = () => {
    history.push('/about')
    setFiles([])
  }

  const goToEval = () => {
    history.push('/evaluation')
  }

  if (Object.entries(words).length !== 0) {
    return (
      <div className="header">
        <h2 onClick={reset}><CreateOutlined style={{fontSize: 60, verticalAlign: 'center'}}/>Text Evaluator</h2>
        <p className="nav" onClick={reset}> <HomeOutlined className="icon"/>Home</p>
        <p style={{fontSize: '20px', display: 'inline', margin: '10px', textDecoration: 'none'}}>|</p>
        <p className="nav" onClick={resetAbout}><InfoOutlined className="icon"/>About</p>
        <p style={{fontSize: '20px', display: 'inline', margin: '10px', textDecoration: 'none'}}>|</p>
        <p className="nav" onClick={goToEval}>Recent Evaluation</p>
      </div>
    )
  }
  return (
    <div className="header">
      <h2 onClick={reset}><CreateOutlined style={{fontSize: 60, verticalAlign: 'center'}}/>Text Evaluator</h2>
      <p className="nav" onClick={reset}> <HomeOutlined className="icon"/>Home</p>
      <p style={{fontSize: '20px', display: 'inline', margin: '10px', textDecoration: 'none'}}>|</p>
      <p className="nav" onClick={resetAbout}><InfoOutlined className="icon"/>About</p>
    </div>
  )
}

const File = ({file, files, setFiles}) => {
  const deleteFile = () => {
    const newFiles = files.filter(curr => curr.name !== file.name)
    setFiles(newFiles)
  }
  return (
    <div className="file">
      <div style={{width: '5%'}}>
        <DescriptionOutlined className="icon"/>
      </div>
      <div style={{width: '75%'}}>
        <p>{file.name} </p>
      </div>
      <div style={{width: '20%'}}>
        <button className="fileBtn" onClick={deleteFile}><DeleteOutlined className="icon" fontSize="small"/>delete</button>
      </div>
    </div>
  )
}

const EvaluateButton = ({files, onClick}) => {
  if(files.length === 0) {
    return (<button disabled={true}><DoneOutlined className="icon" fontSize="small" />Evaluate</button>)
  }
  return (<button onClick={onClick}><DoneOutlined className="icon" fontSize="small" />Evaluate</button>)
}

const CurrentFiles = ({files, setFiles}) => {
  return (
    <div className="currFiles">
      <h1>Current Files (Max of 5)</h1>
      {files.map((file,i) => 
        <File key={i} file={file} files={files} setFiles={setFiles} />
      )}
    </div>
  )
}

const About = () => (
  <div className="about">
    <div className="bg1"></div>
    <p>Drop or select up to 5 files (.pdf, .doc, .docx, or .txt) and this program will evaluate the 100 most used nouns, adjectives, verbs, and adverbs.</p>
    <p>This program works well with average-sized files (less than or equal to 100,000 words). Too small a document and you may not get many results; too large and you may be waiting a while for the results to process.</p>
    <p>Make sure your files are relatively error-free, as this will definitely affect the results.</p>
    <p>Built using React, Golang, and Python. </p>
  </div>
)

const Home = ({ setWords, files, setFiles }) => {
  const history = useHistory()
  const formData = new FormData();
  const [loading, setLoading] = useState(false)

  const handleDrop = acceptedFiles => {
    acceptedFiles.forEach((file) => {
      if(file.type !== "application/pdf" 
        && file.type !== "text/plain" 
        && file.type !== "application/msword" 
        && file.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          alert("wrong file type, only pdfs, txt, doc, and docs files work!")
          return
      }
      if(files.length === 5) {
        alert("Maximum of 5 files!")
      } else if (files.filter(curr => curr.name === file.name).length > 0){ 
        alert("file already added!")
      } else {
        const newFiles = files.concat(file)
        setFiles(newFiles)
      }
    })
  }

  const evaluate = () => {
    files.forEach(file => {
      formData.append('file',file)
    })
    setLoading(true)
    
    fileService.uploadFile(formData).then(res => {
      window.localStorage.setItem('processedData', JSON.stringify(res))
      setWords(res)
      setLoading(false)
      history.push('/evaluation')
    });
  }
  return (
    <div>
      <div className="bg1"></div>
      <Dropzone 
        onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()}/>
            <p>Drag'n'drop a file, or click to select a file.</p>
          </div>
        )}
      </Dropzone>
      <EvaluateButton files={files} onClick={evaluate}/>
      <LoadingScreen
        loading={loading}
        bgColor='#ffffff'
        // https://giphy.com/gifs/art-sonic-youchew-hoJoitYEzdRok
        // logoSrc={loadingImg}
        spinnerColor='#fd5420'
        textColor='#fd5420'
        text='Please wait...'
        children=''
      > 
      </LoadingScreen>
      <CurrentFiles files={files} setFiles={setFiles}/>
    </div>
  )
}

const FilesUsed = ({words}) => {
  return (
    <div>
      <h1>Files Used</h1>
      {Object.keys(words.filenames).map(key => {
        return <p className="filesUsed" key={key}><DescriptionOutlined className="icon"/>{words.filenames[key][0]}</p>
      })}
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
        <button onClick={reset}><ArrowBackIosSharpIcon className="icon"/>back</button>
      </div>
    )
  }

  const options = {
    fontSizes: [12, 60],
    colors: ['#1f77b4', '#9467bd', '#8c564b'],
    fontWeight: 'bold',
  }
  
  var mergedData = []
  var nouns = []
  var adjectives = []
  var verbs = []
  var adverbs = []
  Object.keys(words.merged).forEach(key => {
    mergedData.push({text: key, value: words.merged[key]})
  })
  Object.keys(words.nouns).forEach(key => {
    nouns.push({text: key, count: words.nouns[key]})
  })
  Object.keys(words.adjectives).forEach(key => {
    adjectives.push({text: key, count: words.adjectives[key]})
  })
  Object.keys(words.verbs).forEach(key => {
    verbs.push({text: key, count: words.verbs[key]})
  })
  Object.keys(words.adverbs).forEach(key => {
    adverbs.push({text: key, count: words.adverbs[key]})
  })
  return (
    <div>
      <div className="bg1"></div>
      <div style={{ height: '300px', width: '100%' }}>
        <ReactWordcloud options={options} words={mergedData} />
      </div>
      <div style={{textAlign:'right', float:'right'}}>
        <button onClick={reset}><ArrowBackIosSharpIcon className="icon" style={{fontSize: 18}}/>back</button>
      </div>
      {
        <div className="currFiles">
          <FilesUsed words={words}/>
        </div>
      } 
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
      <h1>Most used {label}</h1>
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
