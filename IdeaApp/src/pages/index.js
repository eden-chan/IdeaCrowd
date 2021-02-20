import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from "./landing";
import Projects from './projects';


const Home = () => {
  return (
    <Switch>
      <Route path='/'>
        <Landing />
      </Route>
      <Route path='projects'>
        <Projects />
      </Route>
    </Switch>
  );
};

export default Home;
