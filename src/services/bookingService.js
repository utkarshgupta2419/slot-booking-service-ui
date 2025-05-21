import axios from "axios";
import {API_BASE_URL} from "../utils/AppConstants";
import {getLocalStorageItem} from "../utils/CommonUtils";

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/booking`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getLocalStorageItem('token')}`
    },
});

export const getBookingsByEmail = (email) => {
    return axiosInstance.get(`/email/${email}`)
}

export const createBookingByEmail = (reqBody) => {
    return axiosInstance.post('', reqBody);
}

axiosInstance.interceptors.request.use(
    (config) => {
        const token = getLocalStorageItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Do something with request error
        return Promise.reject(error);
    }
);