import React from 'react';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import { withAuthorization } from '../Session';
// import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import Checkbox from '@material-ui/core/Checkbox';
import { compose } from 'recompose';
import Grid from '@material-ui/core/Grid';
//import Box from '@material-ui/core/Box';
// import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';

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
const AccountPage = () => (
  <div>
    <AccountInfo/>
    {/* <PasswordForgetForm />
    <PasswordChangeForm /> */}
  </div>
);

const AccountInfo = () => {
  const classes = useStyles();
  return(<Account classes={classes}/>)
}


class AccountC extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      error: null,
    }
  }
  componentDidMount() {
   
    this.props.firebase.auth.onAuthStateChanged((user)=> {
      if (user) {
        this.props.firebase.user(this.props.firebase.auth.currentUser.uid).on('value', snapshot => {
          const usersObject = snapshot.val();
          console.log(usersObject)
          this.setState({username:usersObject.username,
          email:usersObject.email,
          dob:usersObject.dob,
          firstName:usersObject.firstName,
          lastName:usersObject.lastName,
          phone:usersObject.phone,
          instagram:usersObject.instagram,
          onlyfans:usersObject.onlyfans,
          snapchat:usersObject.snapchat,
          youtube:usersObject.youtube,
          })
        })
      } else {
        // No user is signed in.
      }
    });
}
  render() {
    return(
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={this.props.classes.paper}>
        {/* <Avatar className={classes.avatar}> */}
          {/* <LockOutlinedIcon /> */}
        {/* </Avatar> */}
        <Typography component="h1" variant="h5">
          Account Information
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
     
            value={this.state.firstName}
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
            
            value={this.state.lastName}
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
         
            value={this.state.email}
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
       
            value={this.state.dob}
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
         
            value={this.state.phone}
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
            disabled
            value={this.state.username}
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
         
            value={this.state.instagram}
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
      
            value={this.state.onlyfans}
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
           
            value={this.state.snapchat}
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
    
            value={this.state.youtube}
            onChange={this.onChange}
            type="text"
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
            UPDATE
          </Button>
   
          {/* {error && <p>{error.message}</p>} */}
        </form>
      </div>

    </Container>
    )
  }
}

const Account = withFirebase(AccountC);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(AccountPage);