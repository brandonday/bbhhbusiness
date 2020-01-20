import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';

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
const SignInPage = () => (
  <div>
    {/* <h1>SignIn</h1> */}
    <SignInForm />
    {/* <PasswordForgetLink /> */}

    {/* <SignUpLink /> */}
  </div>
);
const INITIAL_STATE = {
  email: '',
  password: '',
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

const SignInFormBaseWrap = (props) => {
  const classes = useStyles();
  return(<SignInFormBase classes={classes} firebase={props.firebase} history={props.history}/>);
}
class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';
    return (
      // <form onSubmit={this.onSubmit}>
      //   <input
      //     name="email"
      //     value={email}
      //     onChange={this.onChange}
      //     type="text"
      //     placeholder="Email Address"
      //   />
      //   <input
      //     name="password"
      //     value={password}
      //     onChange={this.onChange}
      //     type="password"
      //     placeholder="Password"
      //   />
      //   <button disabled={isInvalid} type="submit">
      //     Sign In
      //   </button>
      //   {error && <p>{error.message}</p>}
      // </form>

<Container component="main" maxWidth="xs">
<CssBaseline />
<div className={this.props.classes.paper}>
  {/* <Avatar className={classes.avatar}> */}
    {/* <LockOutlinedIcon /> */}
  {/* </Avatar> */}
  {/* <Typography component="h1" variant="h5">
    Sign In
  </Typography> */}
  <form className={this.props.classes.form} onSubmit={this.onSubmit} noValidate>
    {/* <div style={{display:'flex'}}>
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="email"
      label="email"
      name="email"
      autoComplete="Email"
      autoFocus
      value={email}
      onChange={this.onChange}
      type="text"
      style={{marginRight:10}}
    />
     <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="password"
      label="Password"
      name="password"
      autoComplete="Password"
      autoFocus
      value={password}
      onChange={this.onChange}
      type="text"
      style={{marginLeft:10}}
    />
    </div> */}
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="email"
      label="Email"
      name="email"
      autoComplete="Email"
      autoFocus
      value={email}
      onChange={this.onChange}
      type="text"
    />
    <TextField
      variant="outlined"
      margin="normal"
      required
      fullWidth
      id="password"
      label="Password"
      name="password"
      autoComplete="Password"
      autoFocus
      value={password}
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
      SIGN IN
    </Button>
    <Grid container>
      <Grid item xs>
        <Link to="/pw-forget" variant="body2">
          Forgot password?
        </Link>
      </Grid>
      <Grid item>
        <Link to="signup" variant="body2">
          {"Don't have an account? Sign Up"}
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
const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBaseWrap);
export default SignInPage;
export { SignInForm };