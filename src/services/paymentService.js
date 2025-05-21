import axios from "axios";
import {API_BASE_URL} from "../utils/AppConstants";
import {getLocalStorageItem} from "../utils/CommonUtils";

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/payment`,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getLocalStorageItem('token')}`
    },
});

export const generateOrderId = (reqBody) => {
    return axiosInstance.post('/order/create', reqBody)
}

export const verifyPayment = (reqBody) => {
    return axiosInstance.post('/verify', reqBody);
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