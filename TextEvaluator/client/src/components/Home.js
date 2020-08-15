import React, { useState } from 'react'
import { useHistory } from "react-router-dom"
import EvaluateButton from './EvaluateButton'
import CurrentFiles from './CurrentFiles'
import Loading from './Loading'
import fileService from '../services/fileService'
import Dropzone from 'react-dropzone'

const Home = ({ setWords, files, setFiles}) => {
    const formData = new FormData();
    const [loading, setLoading] = useState(false)
    const history = useHistory()
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
        {window.scrollTo(0,0)}
        <Loading loading={loading}/>
        <CurrentFiles files={files} setFiles={setFiles}/>
      </div>
    )
  }

  
export default Home