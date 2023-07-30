import axios from 'axios';

export default axios.create({
    baseURL: 'http://localhost:4040/api',
    headers: {
        'Content-type': 'application/json'
    }
})