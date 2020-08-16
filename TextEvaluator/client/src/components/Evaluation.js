import React from 'react'
import { useHistory } from "react-router-dom"
import ArrowBackIosSharpIcon from '@material-ui/icons/ArrowBackIosSharp'
import ReactWordcloud from 'react-wordcloud'
import FilesUsed from './FilesUsed'
import ChartData from './ChartData'

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
      enableTooltip: false,
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

export default Evaluation
