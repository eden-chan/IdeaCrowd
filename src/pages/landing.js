import React from 'react';
import { auth } from "../firebase";
import Button from '@material-ui/core/Button'

const Landing = () => {
  const logout = () => {
    auth.signOut();
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh'
      }}
    >
      <Button variant="contained" color="primary" onClick={logout}>Log Out</Button>
    </div>
  );
}

export default Landing;