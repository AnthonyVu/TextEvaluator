import React from 'react'

const About = () => (
    <div className="about">
      <div className="bg1"></div>
      <p>Drop or select up to 5 files (.pdf, .doc, .docx, or .txt) and this program will evaluate the 100 most used nouns, adjectives, verbs, and adverbs.</p>
      <p>This program works well with average-sized files (less than or equal to 100,000 words). Too small a document and you may not get many results; too large and you may be waiting a while for the results to process.</p>
      <p>Make sure your files are relatively error-free, as this will definitely affect the results.</p>
      <p>Built using React, Golang, and Python. </p>
    </div>
)

export default About