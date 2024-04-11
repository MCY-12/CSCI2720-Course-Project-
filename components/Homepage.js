import React from 'react';
import TweetList from './TweetList'; // Assuming TweetList is another component 
import Navigation from './Navigation'; // Assuming Navigation is another component 

const Homepage = () => {
  return (
    <div>
      <Navigation />
      <TweetList />
    </div>
  );
};

export default Homepage;
