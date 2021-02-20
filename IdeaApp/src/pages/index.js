import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from './landing';

const Home = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Landing />
        </Route>
      </Switch>
    </Router>
  );
};

export default Home;
