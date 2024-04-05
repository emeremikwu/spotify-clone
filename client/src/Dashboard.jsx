import React, { useContext } from 'react';
import { AuthContext } from './useAuth';

// eslint-disable-next-line react/prop-types
function Dashboard() {
  const { accessToken } = useContext(AuthContext);

  return (
    <div>{accessToken}</div>
  );
}

export default Dashboard;
