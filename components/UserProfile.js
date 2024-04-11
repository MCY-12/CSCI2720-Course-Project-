import React from 'react';
import UserInfo from './UserInfo'; // Sub-component for user information
import UserTweets from './UserTweets'; // Sub-component for user's tweets

const UserProfile = ({ userId }) => {
  return (
    <div>
      <UserInfo userId={userId} />
      <UserTweets userId={userId} />
    </div>
  );
};

export default UserProfile;
