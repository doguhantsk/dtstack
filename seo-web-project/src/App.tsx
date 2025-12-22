import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Demo from './pages/Demo';
import StartProject from './pages/StartProject';
import About from './pages/About';
import SEO from './components/SEO';

const App: React.FC = () => {
  return (
    <Router>
      <SEO />
      <Header />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/demo" component={Demo} />
        <Route path="/start-project" component={StartProject} />
        <Route path="/about" component={About} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;