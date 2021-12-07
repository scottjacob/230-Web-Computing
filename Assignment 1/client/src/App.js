import React from 'react';
import {BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import  Home from './pages/Home';
import LogInForm from './pages/LogInForm';
import SignUpForm  from './pages/SignUpForm';
import Stocks from './pages/Stocks';
import Quote from './pages/Quote';
import PriceHistory from './pages/PriceHistory';
import { NoMatch } from './pages/NoMatch';
import { Footer } from './components/Footer';


function App() {
  
    return (
      <React.Fragment>
        <Router>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/login" component={LogInForm} />
            <Route exact path="/signup" component={SignUpForm} />
            <Route exact path="/stocks" component={Stocks} />
            <Route exact path="/quote" component={Quote} />
            <Route exact path="/pricehistory" component={PriceHistory} />
            <Route component={NoMatch} />
          </Switch>
        <Footer />
        </Router>
      </React.Fragment>
    );
  
}

export default App;
