import React from 'react';
import DemoViewer from '../components/DemoViewer';

const Demo: React.FC = () => {
    return (
        <div>
            <h1>Demo Section</h1>
            <p>Click the button below to view the uploaded demo HTML file.</p>
            <DemoViewer />
        </div>
    );
};

export default Demo;