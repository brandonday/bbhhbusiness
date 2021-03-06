import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import { withFirebase } from '../Firebase';

import Main from '../Main';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import SignInAdmin from '../SignInAdmin';

import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Schedule from '../schedule';

import Create from '../create';
import Payment from '../payment';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { render } from '@testing-library/react';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authUser: null,
    };
  }
  componentDidMount() {
    this.props.firebase.auth.onAuthStateChanged(authUser => {
      authUser
        ? this.setState({ authUser })
        : this.setState({ authUser: null });
    });
  }
  componentWillUnmount() {
    this.listener();
  }
render() {
  return(
    <AuthUserContext.Provider value={this.state.authUser}>

  <Router>
    <div>
      <Navigation />
      <hr />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route path={ROUTES.SIGN_IN} component={SignInPage} />
      <Route path={ROUTES.SIGN_IN_ADMIN} component={SignInAdmin} />

      <Route
        path={ROUTES.PASSWORD_FORGET}
        component={PasswordForgetPage}
      />
     
      <Route path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route path={ROUTES.ADMIN} component={AdminPage} />
      <Route path={ROUTES.SCHEDULE_PAGE} component={Schedule} />
      <Route path={ROUTES.POST_CREATION} component={Create} />
      <Route path={ROUTES.PAYMENT} component={Payment} />
    </div>
  </Router>
  </AuthUserContext.Provider>

  )
};
}

export default withFirebase(App);