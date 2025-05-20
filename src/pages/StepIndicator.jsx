import React from 'react';
import styles from './BookingForm.module.css';

const StepIndicator = ({ currentStep }) => {
    const steps = ['Service', 'Information', 'Date & Time', 'Payment', 'Confirmation'];

    return (
        <div className={styles.stepContainer}>
            {steps.map((step, index) => (
                <div key={index} className={`${styles.step} ${currentStep === index + 1 ? styles.active : ''}`}>
                    <span>{index + 1}</span>
                    <p>{step}</p>
                </div>
            ))}
        </div>
    );
};

export default StepIndicator;
