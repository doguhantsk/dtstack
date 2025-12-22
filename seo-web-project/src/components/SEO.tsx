import React from 'react';
import { Helmet } from 'react-helmet';

const SEO: React.FC<{ title: string; description: string; keywords: string }> = ({ title, description, keywords }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="robots" content="index, follow" />
            <link rel="canonical" href={window.location.href} />
        </Helmet>
    );
};

export default SEO;