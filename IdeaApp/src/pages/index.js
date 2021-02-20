import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from "./landing"


const Home = () => {
  return (
    <Switch>
      <Route path='/' component={Landing} />
    </Switch>
  );
};

export default Home;
