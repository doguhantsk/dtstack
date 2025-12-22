import React from 'react';

const About: React.FC = () => {
    return (
        <div>
            <h1>About This Project</h1>
            <p>
                This project is a web application designed to showcase various features and functionalities.
                It includes a demo section, a way to start new projects, and provides information about the project itself.
            </p>
            <h2>Features</h2>
            <ul>
                <li>Homepage with an overview of the project</li>
                <li>Demo section to view uploaded HTML files</li>
                <li>Start Project section to send emails</li>
                <li>SEO-friendly structure for better visibility</li>
            </ul>
            <h2>Developer Information</h2>
            <p>
                Developed by [Your Name]. This project aims to provide a user-friendly interface and efficient functionality.
            </p>
        </div>
    );
};

export default About;