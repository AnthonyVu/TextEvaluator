import axios from 'axios';

const baseURL = 'http://localhost:3001/'

const config = {
    headers: {
        'content-type': 'multipart/form-data'
    }
}

const uploadFile = async (object) => {
    console.log('uploading file')
    const req = await axios.post(baseURL, object, config)
    return req.data
}

export default { uploadFile }