import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';

import Grid from '@material-ui/core/Grid';
//import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const INITIAL_STATE = {
  username: '',
  email: '',
  dob:'',
  firstName:'',
  lastName:'',
  phone:'',
  instagram:'',
  onlyfans:'',
  snapchat:'',
  youtube:'',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const SignUpPage = () => {
  return(<div>
    <SignUpForm/>
  </div>)
};

const SignUpFormBaseWrap = (props) => {
  const classes = useStyles();
  return(<SignUpFormBase classes={classes} firebase={props.firebase} history={props.history}/>);
}

class SignUpFormBase extends Component {
  
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
    
  }
  
  onSubmit = event => {
    const {   username,
    email,
    dob,
    firstName,
    lastName,
    phone,
    instagram,
    onlyfans,
    snapchat,
    youtube,
    passwordOne,
    passwordTwo,
    error } = this.state;
    
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        return this.props.firebase
        .user(authUser.user.uid)
        .set({
          username,
          email,
          firstName, 
          dob,
          lastName,
          phone,
          instagram,
          onlyfans,
          snapchat,
          youtube,
          passwordOne, 
          passwordTwo  
        });
      })
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  }
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const {
      username,
      email,
      dob,
      firstName,
      lastName,
      phone,
      instagram,
      onlyfans,
      snapchat,
      youtube,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;
    const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '' ||
    username === '';
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={this.props.classes.paper}>
        {/* <Avatar className={classes.avatar}> */}
          {/* <LockOutlinedIcon /> */}
        {/* </Avatar> */}
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <form className={this.props.classes.form} onSubmit={this.onSubmit} noValidate>
          <div style={{display:'flex'}}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="First Name"
            name="firstName"
            autoComplete="First Name"
            autoFocus
            value={firstName}
            onChange={this.onChange}
            type="text"
            style={{marginRight:10}}
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Last Name"
            name="lastName"
            autoComplete="Last Name"
            
            value={lastName}
            onChange={this.onChange}
            type="text"
            style={{marginLeft:10}}
          />
          </div>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="Email"
         
            value={email}
            onChange={this.onChange}
            type="text"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="dob"
            label="Date of Birth"
            name="dob"
            autoComplete="Date of Birth"
       
            value={dob}
            onChange={this.onChange}
            type="text"
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="phone"
            label="Phone"
            name="phone"
            autoComplete="Phone"
         
            value={phone}
            onChange={this.onChange}
            type="text"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="Username"
           
            value={username}
            onChange={this.onChange}
            type="text"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Instagram"
            label="Instagram"
            name="instagram"
            autoComplete="Instagram"
         
            value={instagram}
            onChange={this.onChange}
            type="text"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Onlyfans"
            label="Onlyfans"
            name="onlyfans"
            autoComplete="Onlyfans"
      
            value={onlyfans}
            onChange={this.onChange}
            type="text"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="snapchat"
            label="Snapchat"
            name="snapchat"
            autoComplete="Snapchat"
           
            value={snapchat}
            onChange={this.onChange}
            type="text"
          />
           <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="youtube"
            label="Youtube"
            name="youtube"
            autoComplete="Youtube"
    
            value={youtube}
            onChange={this.onChange}
            type="text"
          />
          
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="passwordOne"
            label="Password"
            type="password"
            id="passwordOne"
            autoComplete="current-password"
            value={passwordOne}
            onChange={this.onChange}
            type="password"
          />
            <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="passwordTwo"
            label="Password"
            id="password"
            autoComplete="current-password"
            value={passwordTwo}
            onChange={this.onChange}
            type="password"
          />
      
          {/* <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          /> */}
          <Button
       
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={this.props.classes.submit}
          >
            CREATE A NEW ACCOUNT
          </Button>
          <Grid container>
            {/* <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid> */}
            <Grid item>
              <Link to="/signin" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Grid>
          </Grid>
          {error && <p>{error.message}</p>}
        </form>
      </div>

    </Container>
    );
  }
}
const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBaseWrap);


export default SignUpPage;
export { SignUpForm, SignUpLink };