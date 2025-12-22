import axios from 'axios';

const API_URL = 'https://api.example.com/send-email'; // Placeholder for the email API URL
const API_KEY = process.env.EMAIL_API_KEY; // Placeholder for the email API key

export const sendEmail = async (emailData) => {
    try {
        const response = await axios.post(API_URL, emailData, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};