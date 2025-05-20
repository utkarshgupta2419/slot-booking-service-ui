import axios from "axios";
import {API_BASE_URL, AUTH_ENDPOINTS} from "../utils/AppConstants";

const axiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/auth`,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = (reqBody) => {
    return axiosInstance.post(AUTH_ENDPOINTS.LOGIN, reqBody);
};


export const signup = (reqBody) => {
    return axiosInstance.post(AUTH_ENDPOINTS.SIGNUP, reqBody)
};


export const confirm = (token) => {
    return axiosInstance.post(AUTH_ENDPOINTS.CONFIRM, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
};

export const logout = (token) => {
    return axiosInstance.post(AUTH_ENDPOINTS.LOGIN, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
};