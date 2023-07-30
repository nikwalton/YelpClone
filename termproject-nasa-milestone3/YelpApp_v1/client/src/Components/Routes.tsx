import React from "react";

import { BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import BusinessSearch from "../Pages/BusinessSearch";
import UserSearch from "../Pages/UserSearch";
import HomeScreen from "../Pages/HomeScreen";

const Routes = () =>
    <Router>
        <Route exact path='/'>
            <HomeScreen />
        </Route>
        <Route exact path='/user'>
            <UserSearch />
        </Route>
        <Route path='/business'>
            <BusinessSearch />
        </Route>
    </Router>
export default Routes;