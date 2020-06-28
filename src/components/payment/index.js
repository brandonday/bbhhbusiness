import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Navigation from '../Navigation';
import { withFirebase } from '../Firebase';

import Main from '../Main';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import Schedule from '../schedule';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { render } from '@testing-library/react';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import StripeCheckout from 'react-stripe-checkout';


const useStyles = makeStyles({
  card: {
    maxWidth: 345,
  },
});


function ImgMediaCard(props) {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={props.paymentType}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {props.name}
          </Typography>
          {/* <Typography variant="body2" color="textSecondary" component="p">
            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
            across all continents except Antarctica
          </Typography> */}
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" href="https://paypal.me/BSpellman">
          SELECT
        </Button>
  <iframe src="https://paypal.me/BSpellman" height="300px" width="400px" />
      </CardActions>
    </Card>
  );
}

class Payment extends Component {
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
    // this.listener.bind(this);
  }
  onToken = (token) => {
    // fetch('/save-stripe-token', {
    //   method: 'POST',
    //   body: JSON.stringify(token),
    // }).then(response => {
    //   response.json().then(data => {
        alert(`We are in business`);
        this.props.history.push('/create')
    //   });
    // });
  }
render() {
  return(
    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>

      <div>
      <StripeCheckout
        token={this.onToken}
        amount={1000000}
        stripeKey="pk_test_Q6reqf3uW0kpszTbYJWu3ePv00DlbyIu2Z"
      />
      </div>
      {/* <Button href="/create">Google</Button>
      <Button href="/create">Paypal</Button>
      <Button href="/create">Credit Card</Button> */}
    </div>

  )
};
}

export default withFirebase(Payment);