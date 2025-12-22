import React from 'react';
import './Footer.css'; // Assuming you have a CSS file for footer styles

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                <nav>
                    <ul>
                        <li><a href="/about">About</a></li>
                        <li><a href="/demo">Demo</a></li>
                        <li><a href="/start-project">Start Project</a></li>
                    </ul>
                </nav>
            </div>
        </footer>
    );
};

export default Footer;