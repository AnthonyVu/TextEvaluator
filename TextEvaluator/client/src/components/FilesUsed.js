import React from 'react'
import DescriptionOutlined from '@material-ui/icons/DescriptionOutlined'

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

export default FilesUsed