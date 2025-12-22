import React, { useState } from 'react';
import { sendEmail } from '../services/emailService';

const StartProject: React.FC = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await sendEmail(email, message);
            setSuccess('Email sent successfully!');
        } catch (err) {
            setError('Failed to send email. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="start-project">
            <h1>Start Your Project</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Sending...' : 'Send Email'}
                </button>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
            </form>
        </div>
    );
};

export default StartProject;