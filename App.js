import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import Homepage from './components/Homepage';

import AddTweetModal from './components/AddTweetModal';
import UserManagement from './components/UserManagement';
import UserProfile from './components/UserProfile';
import Navigation from './components/Navigation';
// other imports

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/home" component={Homepage} />
        <Route path="/signup" component={Signup} />
        <Route path="/addtweetmodal" component={AddTweetModal} />
        <Route path="/usermanagement" component={UserManagement} />
        <Route path="/userprofile" component={UserProfile} />
        {/* other routes */}
      </Switch>
    </Router>
  );
}

export default App;
