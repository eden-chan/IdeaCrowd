import React from 'react';
import { auth } from "../firebase";
import '../pages/main.css'

class Logout extends React.Component {
    constructor(props) {
      super(props);
  
      this.logout = this.logout.bind(this);
    }
  
    logout() {
      auth.signOut();
    }
  
    render() {
      return (
        <div className="logout" onClick={this.logout}>Log Out</div>
      );
    }
  };
  
export default Logout;