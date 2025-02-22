import React, { useContext } from 'react'; // Import useContext and React
import UserContext from '../UserContext'; // Import UserContext

function UserProfile() {
  // Consume the context using useContext
  const userData = useContext(UserContext);

  return (
    <div>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
}

export default UserProfile;
