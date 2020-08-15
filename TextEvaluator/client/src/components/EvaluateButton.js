import React from 'react'
import DoneOutlined from '@material-ui/icons/DoneOutlined'

const EvaluateButton = ({files, onClick}) => {
    if(files.length === 0) {
      return (<button disabled={true}><DoneOutlined className="icon" fontSize="small" />Evaluate</button>)
    }
    return (<button onClick={onClick}><DoneOutlined className="icon" fontSize="small" />Evaluate</button>)
  }
export default EvaluateButton