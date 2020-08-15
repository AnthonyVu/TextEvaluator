import React from 'react'
import DeleteOutlined from '@material-ui/icons/DeleteOutlined'
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined'

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

export default File