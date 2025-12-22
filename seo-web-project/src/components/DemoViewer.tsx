import React from 'react';

const DemoViewer: React.FC<{ demoFile: string }> = ({ demoFile }) => {
    return (
        <div>
            <h2>Demo Viewer</h2>
            <iframe
                src={demoFile}
                title="Demo Viewer"
                style={{ width: '100%', height: '600px', border: 'none' }}
            />
        </div>
    );
};

export default DemoViewer;