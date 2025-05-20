import {useEffect, useState} from 'react';
import styles from './BookingForm.module.css';
import StepIndicator from './StepIndicator';
import Calendar from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    dateFormatter,
    getLocalStorageItem,
    ServiceCostEnum,
    ServicesEnum,
    TargetRoleEnum,
    timeSlots, TimeToFormattedTimeEnum
} from "../utils/CommonUtils";
import { generateOrderId, verifyPayment } from '../services/paymentService';
import { createBookingByEmail } from '../services/bookingService';
import {COMPANY_NAME, CURRENCY_INR, PAYMENT_DESC, RAZORPAY_KEY} from "../utils/AppConstants";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";


const BookingForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState('');
    const [formData, setFormData] = useState({
        fullName: getLocalStorageItem('fullName'),
        email: getLocalStorageItem('email'),
        phone: getLocalStorageItem('phone'),
        resumeLink: '',
        targetRole: '',
        notes: '',
        serviceType: '',
        amount: '',
        appointmentDate: null,
        appointmentTime: '',
        orderId: null,
        paymentSuccess: false,
        paymentError: null,
    });
    const [isNextDisabled, setIsNextDisabled] = useState(true);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [bookingResponse, setBookingResponse] = useState({});
    useEffect(() => {
        if (step === 1) {
            setIsNextDisabled(!formData.serviceType);
        } else if (step === 3) {
            setIsNextDisabled(!formData.appointmentDate || !formData.appointmentTime);
        } else {
            setIsNextDisabled(false);
        }
    }, [step, formData.serviceType, formData.appointmentDate, formData.appointmentTime]);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });
      };

    const createRazorpayOrder = async (e) => {
        e.preventDefault();
        const res = await loadRazorpayScript();
        if (!res) {
            toast.error('Failed to load Razorpay SDK');
            return;
        }
        const reqBody = {
            "userEmail": formData?.email,
            "receiptId": `receipt_${new Date().getTime()}`,
            "amount": formData?.amount,
            "currency": CURRENCY_INR
        }
        generateOrderId(reqBody).then((res) => {
            console.log(res);
        const options = {
            key: RAZORPAY_KEY,
            order_id: res?.data?.orderId,
            amount: res?.data?.amount,
            currency: res?.data?.currency,
            name: COMPANY_NAME,
            description: PAYMENT_DESC,
            handler: function (response) {
              verifyPayment({
                "orderId": response?.razorpay_order_id,
                "paymentId": response?.razorpay_payment_id,
                "signature": response?.razorpay_signature
              }).then ((res) => {
                createBookingByEmail({
                    "userName": formData?.fullName,
                    "userEmail": formData?.email,
                    "phoneNumber": formData?.phone,
                    "resumeLink": formData?.resumeLink,
                    "targetRole": formData?.targetRole,
                    "additionalNote": formData?.additionalNote,
                    "selectedService": formData?.serviceType,
                    "date": dateFormatter(formData?.appointmentDate),
                    "time": TimeToFormattedTimeEnum[formData?.appointmentTime],
                    "paymentId": response?.razorpay_payment_id
                }).then ((res) => {
                    setBookingResponse(res?.data);
                    console.log("Payment verified and order created...")
                    setStep(5);
                }).catch((err) => {
                    console.log(err);
                    toast.error('Could not create booking.');
                })
              }).catch((err) => {
                console.log(err);
                  toast.error('Payment verification failed');
              })
            },
            prefill: {
                name: formData?.fullName,
                email: formData?.email,
                contact: formData?.phone,
            },
            theme: {
              color: '#3399cc',
            },
          };
  
          const rzp = new window.Razorpay(options);
          rzp.open();
        }).catch((error)=> {
            console.log(error);
            toast.error('Could not create payment order');
        });
    };

    const handleChange = (e) => {
        const name = e?.target?.name;
        const value = e?.target?.value;
        if ('serviceType' === name) {
            setSelectedService(value);
            const serviceAndAmount = value.split('@');
            const serviceValue = serviceAndAmount[0];
            let amountValue = serviceAndAmount[1];
            setFormData({...formData, ['serviceType']: serviceValue, ['amount']: amountValue})
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, appointmentDate: date });
    };

    const handleNext = () => {
        if (step < 5 && !isNextDisabled) setStep((prev) => prev + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep((prev) => prev - 1);
    };

    const handleGoToDashboard = () => {
        navigate('/dashboard');
    }
    const handleBookNewSlot = () => {
        setStep(1);
        navigate('/booking-form');
    }

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className={styles.field}>
                        <label>Select a Service</label>
                        <select
                            name="serviceType"
                            value={selectedService}
                            onChange={handleChange}
                            required
                        >
                            <option value="">-- Select --</option>
                            {Object.keys(ServicesEnum).map(service => (
                                <option key={service} value={ServicesEnum[service] + '@' + ServiceCostEnum[service]}>
                                    {service + '-' + ServiceCostEnum[service]}
                                </option>))}
                        </select>
                    </div>
                );
            case 2:
                return (
                    <>
                        <div className={styles.field}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="fullName"
                                value={getLocalStorageItem("userName")}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                value={getLocalStorageItem("email")}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Phone Number</label>
                            <input
                                type="text"
                                name="phone"
                                value={getLocalStorageItem("phoneNumber")}
                                onChange={handleChange}
                                readOnly
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Current Resume Link (if any)</label>
                            <input
                                type="text"
                                name="resumeLink"
                                value={formData.resumeLink}
                                onChange={handleChange}
                            />
                        </div>
                        <div className={styles.field}>
                            <label>Target Role</label>
                            <select
                                name="targetRole"
                                value={formData.targetRole}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Target Role --</option>
                                {Object.keys(TargetRoleEnum).map(role => (
                                    <option key={role} value={TargetRoleEnum[role]}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Additional Notes</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>
                    </>
                );
            case 3:
                return (
                    <div style={{ display: 'flex' }}>
                        <div style={{ flex: 1, marginRight: '1rem' }}>
                            <label>Select Appointment Date</label>
                            <Calendar
                                selected={formData.appointmentDate}
                                onChange={handleDateChange}
                                minDate={new Date()} // Disable previous dates
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label>Select Appointment Time</label>
                            <select
                                name="appointmentTime"
                                value={formData.appointmentTime}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Time --</option>
                                {timeSlots.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h3>Payment</h3>
                        {formData.paymentError && <p style={{ color: 'red' }}>{formData.paymentError}</p>}
                        {!formData.orderId && !formData.paymentError && (
                            <button onClick={createRazorpayOrder}>
                                Pay
                            </button>
                        )}
                        {!razorpayLoaded && formData.paymentError && (
                            <p>Error loading payment gateway. Please try again.</p>
                        )}
                    </div>
                );
            case 5:
                return (
                    <div>
                        <h3>Final Confirmation</h3>
                        <p><strong>Selected Service:</strong> {formData?.serviceType}</p>
                        <p><strong>Email:</strong> {formData?.email}</p>
                        <p><strong>Resume Link:</strong> {formData?.resumeLink || 'Not provided'}</p>
                        <p><strong>Target Role:</strong> {formData?.targetRole}</p>
                        <p><strong>Additional Notes:</strong> {formData?.notes || 'None'}</p>
                        <p><strong>Appointment Date:</strong> {formData?.appointmentDate ? formData?.appointmentDate.toLocaleDateString() : 'Not Selected'}</p>
                        <p><strong>Appointment Time:</strong> {formData?.appointmentTime || 'Not Selected'}</p>
                        <button type="button" className={styles.nextBtn}
                                onClick={handleGoToDashboard}>
                            Go to dashboard
                        </button>
                        <button type="button" className={styles.nextBtn}
                                onClick={handleBookNewSlot}>
                            Book another slot
                        </button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (

        <div className={styles.container}>
            <h2 className={styles.title}>Book a Session</h2>

            <StepIndicator currentStep={step} totalSteps={5} />

            <form className={styles.form}>
                {renderStepContent()}

                <div className={styles.actions}>
                    {step !== 5 && <button
                        type="button"
                        onClick={handleBack}
                        className={styles.backBtn}
                        disabled={step === 1 && formData?.serviceType}
                    >
                        Back
                    </button>}
                    {4 !== step && 5 !== step && <button
                        type="button"
                        onClick={handleNext}
                        className={styles.nextBtn}
                        disabled={isNextDisabled}
                    >
                         Continue →
                    </button>}
                </div>
            </form>
        </div>
    );
};

export default BookingForm;