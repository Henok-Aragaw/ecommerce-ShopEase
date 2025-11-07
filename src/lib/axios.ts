import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://dummyjson.com',
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})


api.interceptors.response.use(
 (res) => res.data,
 (error) => Promise.reject(error.response || error)
)