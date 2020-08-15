import React from 'react'
import File from './File'

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


export default CurrentFiles