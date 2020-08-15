import React from 'react'
import { useHistory } from "react-router-dom"
import CreateOutlined from '@material-ui/icons/CreateOutlined'
import HomeOutlined from '@material-ui/icons/HomeOutlined'
import InfoOutlined from '@material-ui/icons/InfoOutlined'

const Header = ({words, setFiles}) => {
  const history = useHistory()
  const goToHome = () => {
    history.push('/')
    setFiles([])
  }

  const goToAbout = () => {
    history.push('/about')
    setFiles([])
  }

  const goToEval = () => {
    history.push('/evaluation')
  }

  if (Object.entries(words).length !== 0) {
    return (
      <div className="header">
        <h2 onClick={goToHome}><CreateOutlined style={{fontSize: 60, verticalAlign: 'center'}}/>Text Evaluator</h2>
        <p className="nav" onClick={goToHome}> <HomeOutlined className="icon"/>Home</p>
        <p style={{fontSize: '20px', display: 'inline', margin: '10px', textDecoration: 'none'}}>|</p>
        <p className="nav" onClick={goToAbout}><InfoOutlined className="icon"/>About</p>
        <p style={{fontSize: '20px', display: 'inline', margin: '10px', textDecoration: 'none'}}>|</p>
        <p className="nav" onClick={goToEval}>Recent Evaluation</p>
      </div>
    )
  }
  return (
    <div className="header">
      <h2 onClick={goToHome}><CreateOutlined style={{fontSize: 60, verticalAlign: 'center'}}/>Text Evaluator</h2>
      <p className="nav" onClick={goToHome}> <HomeOutlined className="icon"/>Home</p>
      <p style={{fontSize: '20px', display: 'inline', margin: '10px', textDecoration: 'none'}}>|</p>
      <p className="nav" onClick={goToAbout}><InfoOutlined className="icon"/>About</p>
    </div>
  )
}

export default Header