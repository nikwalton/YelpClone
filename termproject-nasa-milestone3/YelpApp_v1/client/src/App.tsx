import React from 'react';
import logo from './logo.svg';
import './App.css';

import NASA_NAV from './Components/NASA_NAV';
import UserSearch from './Pages/UserSearch';

import  {BrowserRouter as Router, Route} from 'react-router-dom';
import Routes from './Components/Routes';

function App() {
  return (
    <div className="App">
      <Router>
        <NASA_NAV />
        <Routes />
      </Router>
    </div>
  );
}

export default App;
