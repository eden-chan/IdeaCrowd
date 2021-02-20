import React, { Component } from "react";
import { observer } from "mobx-react";
import '../App.css'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from '../pages';
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import RootStore from "../models/RootStore";
import {RootStoreProvider} from "../models/RootStoreContext"
import { auth } from "../firebase"
import PrivateRoute from "../components/PrivateRoute"
import PublicRoute from "./PublicRoute"
import bear from "../assets/bear.jpg";



const rootStore = RootStore.create()

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      loading: true
    }
  }

  componentDidMount() {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      if (user) {
        this.setState({
          authenticated: true,
          loading: false,
        });
      } else {
        this.setState({
          authenticated: false,
          loading: false,
        });
      }
    });
  }

  render() {
    return this.state.loading === true ? <h2>Loading...</h2> : (
      <div style={{backgroundImage: `url(${bear})`, height: '100%'}}>
        <RootStoreProvider value={rootStore}>
          <Router>
            <Switch>
              <PublicRoute path='/signin' component={SignIn} authenticated={this.state.authenticated} exact={true} user={this.state.user}/>
              <PublicRoute path='/signup' component={SignUp} authenticated={this.state.authenticated} exact={true} user={this.state.user}/>
              <PrivateRoute path='/' component={Home} authenticated={this.state.authenticated} user={this.state.user}/>
            </Switch>
          </Router>
        </RootStoreProvider>
      </div>
    );
  }
}

export default observer(App);
