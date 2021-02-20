import React from 'react';
import { useState } from 'react';
import { auth } from '../firebase';
import Button from '@material-ui/core/Button';

import { DashboardLayout } from '../components/Layout';

const Landing = () => {
  const [count, setCount] = useState(0);

  const logout = () => {
    auth.signOut();
  };

  return (
    <DashboardLayout>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '90vh',
        }}
      >
        <Button variant="contained" color="primary" onClick={logout}>
          Log Out
        </Button>
        <div style={{ marginLeft: '15px' }}>
          <Button variant="contained" color="secondary" onClick={() => setCount(count + 1)}>
            {count}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Landing;
