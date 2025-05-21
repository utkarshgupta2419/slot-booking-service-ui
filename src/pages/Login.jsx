import React from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './Login.module.css';
import {ROUTES} from "../utils/AppConstants";
import {confirm, login} from "../services/authService";
import {clearLocalStorage, getLocalStorageItem, setLocalStorage} from "../utils/CommonUtils";
import {toast} from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    let token = getLocalStorageItem('token');
    if (token) {
        confirm(token).then(res => {
            if (res?.data === 'true' || res?.data === true) {
                navigate('/dashboard');
            } else {
                clearLocalStorage();
            }
        }).catch(err => {
            toast.error("Token expired.")
            clearLocalStorage();
        })
    } else {
        clearLocalStorage();
    }

    function handleDashboardRedirect() {
        navigate(ROUTES.DASHBOARD);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const {elements} = e.target;
        let email = elements[0].value;
        let password = elements[1].value;
        const reqBody = {
            "email": email,
            "password": password
        };
        login(reqBody).then(res => {
            console.log("Login Successful. Redirecting to Dashboard.")
            storeUserInfo(res?.data);
            handleDashboardRedirect();
        }).catch(err => {
            toast.error("Login Attempt failed.")
        });
    };

    const storeUserInfo = (authResponse) => {
        setLocalStorage(authResponse);
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>Login</h2>
                <form onSubmit={e => handleLogin(e)} className={styles.form}>
                    <input type="email" placeholder="Email" required className={styles.input}/>
                    <input type="password" placeholder="Password" required className={styles.input}/>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
                <p className={styles.text}>
                    Don't have an account?{' '}
                    <span onClick={() => navigate('/signup')} className={styles.link}>Sign Up</span>
                </p>
            </div>
        </div>
    );
};

export default Login;