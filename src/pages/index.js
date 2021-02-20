import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Landing from "./landing"
import { FaPaw } from "react-icons/fa";
import forest2 from "../assets/fall-forest.jpg"
import forest4 from "../assets/forest2.png"


const Home = () => {
  return (
    <Switch>
      <Route path='/else' component={Landing} />
      <Route path='/' component={Landing} />
    </Switch>
  );
};

export default Home;
