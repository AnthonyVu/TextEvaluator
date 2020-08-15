import React from 'react'
import loadingGif from '../images/loading.gif'

const Loading = ({loading}) => {
    if(loading) {
      return (
        <div>
          <div className="bg2"></div>
          <div className="overlay"><img src={loadingGif} alt="loading"/>Please Wait...</div>
        </div>
      )
    }
    return <div></div>
  }

export default Loading