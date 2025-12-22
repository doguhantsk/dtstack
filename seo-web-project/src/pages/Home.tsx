import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const Home: React.FC = () => {
    return (
        <div>
            <SEO title="Home" description="Welcome to our web development project" />
            <header>
                <h1>Welcome to Our Web Development Project</h1>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/demo">Demo</Link></li>
                        <li><Link to="/start-project">Start Project</Link></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </nav>
            </header>
            <main>
                <section>
                    <h2>Explore Our Features</h2>
                    <p>Check out our demo section to see our project in action!</p>
                    <p>Ready to start your own project? Visit the Start Project section!</p>
                    <p>Learn more about us in the About section.</p>
                </section>
            </main>
            <footer>
                <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Home;