export const setLocalStorage = (items) => {
    Object.entries(items).forEach(([k, v]) => {
        localStorage.setItem(k, v.toString());
    });
};

export const getLocalStorageItem = (item) => {
    return localStorage.getItem(item);
}

export const clearLocalStorage = () => {
    localStorage.clear();
}

export const ServicesEnum = {
    "Resume Review": "RESUME_REVIEW",
    "Mock Interview": "MOCK_INTERVIEW",
    "Project Discussion": "PROJECT_DISCUSSION",
    "Live Coding Session": "LIVE_CODING_SESSION",
    "System Design Interview": "SYSTEM_DESIGN_INTERVIEW",
    "Offer Negotiation": "OFFER_NEGOTIATION"
};

export const ServiceCostEnum = {
    "Resume Review": "999",
    "Mock Interview": "2499",
    "Project Discussion": "499",
    "Live Coding Session": "999",
    "System Design Interview": "1999",
    "Offer Negotiation": "7999"
}

export const TargetRoleEnum = {
    "Frontend Developer": "FRONTEND_DEVELOPER",
    "Backend Developer": "BACKEND_DEVELOPER",
    "Data Analyst": "DATA_ANALYST",
    "Data Engineer": "DATA_ENGINEER",
    "DevOps Engineer": "DEVOPS_ENGINEER"
};

export const dateFormatter = (date) => {

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

export const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
];


export const TimeToFormattedTimeEnum = {
    '9:00 AM' : "09:00", '10:00 AM': "10:00", '11:00 AM': "11:00", '12:00 PM': "12:00",
    '1:00 PM' : "13:00", '2:00 PM' : '14:00', '3:00 PM': '15:00', '4:00 PM': '16:00', '5:00 PM': '17:00'
}