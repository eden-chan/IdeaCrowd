import React from 'react';
import { auth } from "../firebase";
import Button from '@material-ui/core/Button'

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    auth.signOut();
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh'
        }}
      >
        <Button onClick={this.logout}>log out</Button>
      </div>
    );
  }
};

export default Landing;