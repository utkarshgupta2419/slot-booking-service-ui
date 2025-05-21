import React, {useEffect, useState} from 'react';
import styles from './Dashboard.module.css';
import {useNavigate} from 'react-router-dom';
import {getLocalStorageItem} from "../utils/CommonUtils";
import {getBookingsByEmail} from "../services/bookingService";
import {toast} from "react-toastify";

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = () => {
        const email = getLocalStorageItem("email");
        getBookingsByEmail(email).then(res => {
            const bookings = res?.data;
            setBookings(bookings);
        }).catch(err => {
            toast.error("Unable to fetch upcoming slot details.")
        })
    };

    const handleBookSlot = () => {
        navigate('/booking-form');
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Dashboard</h2>
                <button className={styles.bookButton} onClick={handleBookSlot}>Book a Slot</button>
            </div>
            <div>
                <div className={styles.section}>
                    <h3>Upcoming Bookings</h3>
                    {bookings.length === 0 ? (
                        <p>No upcoming slots found.</p>
                    ) : (
                        <ul className={styles.bookingList}>
                            {bookings.map((booking, index) => (
                                <li key={index} className={styles.bookingItem}>
                                    <strong>{booking.date}</strong> at <strong>{booking.time}</strong>
                                    <div>Target Role: {booking?.targetRole}</div>
                                    <div>Note: {booking?.additionalNote}</div>
                                    <div>Service: {booking?.selectedService}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Dashboard;
