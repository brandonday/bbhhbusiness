import React, { useState, useRef, useEffect } from "react";
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
// import Create from '../create';
import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../Session';
import { render } from '@testing-library/react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';

import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Storage from '../Firebase';
import Hashids from 'hashids'
const hashids = new Hashids('',5)

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
  media: {
    height: 300,
    backgroundSize:'contain',
    backgroundColor:'rgba(0, 0, 0, 0.09)',
  },
  card: {
    maxWidth: 500,
    width:'100%',
    margin:'20px 0px',
    padding:20
  },
}));

let setImageFile = false;

const useForceUpdate = () => useState()[1];

function Create(props) {
  const fileInput = useRef(null);
  const forceUpdate = useForceUpdate();
  const classes = useStyles()
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  useEffect(e => {
    window.addEventListener("keyup", clickFileInput);
    return () => window.removeEventListener("keyup", clickFileInput);
  });

  function clickFileInput(e) {
    if (fileInput.current.nextSibling.contains(document.activeElement)) {
      // Bind space to trigger clicking of the button when focused
      if (e.keyCode === 32) {
        fileInput.current.click();
      }
      
    }
  }
  
  let updateInputValue = (evt) => {
    setText({
      text: evt.target.value
    });
  }
  let onSubmit = (e) => {
    e.preventDefault();
    const data = fileInput.current.files;
    console.log(props.firebase.storage)
    props.firebase.storage.child(data[0].name).put(data[0]).then(function(snapshot){
      console.log('uploaded a blob')
      snapshot.ref.getDownloadURL().then(function(downloadURL) {
        console.log("File available at", downloadURL);

        
       

       
      let data = JSON.parse(localStorage.getItem("schedule"));
      let shortID = hashids.encode(Math.floor(Math.random() * 10));
    
      props.firebase.database().ref(`pending/${shortID}`).set({
        userId:props.firebase.auth.currentUser.uid,
        url:downloadURL,
        month:data.month,
        platform:data.platform,
        date:data.date,
        days:data.days,
        price:data.price,
        hours:data.hours,
        shortID:shortID,
        approved:false,
        text:text
      },function(error) {
        if (error) {
          // The write failed...
        } else {
          alert('thank you')
          props.firebase.database().ref('user/' + props.firebase.auth.currentUser.uid).push({
            userId:props.firebase.auth.currentUser.uid,
            url:downloadURL,
            month:data.month,
            platform:data.platform,
            date:data.date,
            days:data.days,
            price:data.price,
            hours:data.hours,
            shortID:shortID,
            approved:false,
            text:text
          });
          
          //window.location.replace('/home')
        }
      });
     
      });
 
      


    })
  }

  const fileNames = ()=> {
    const { current } = fileInput;
    if (current && current.files.length > 0) {
      
      let messages = [];
      for (let file of current.files) {
        if(setImageFile == false) {
          console.log(current.files[0]);

          var reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = function () {
            console.log(reader.result);
            setCount(reader.result);
          };
        
          
          setImageFile = true;
        }
        // messages = messages.concat(<p key={file.name}>{file.name}</p>);
      }
      
      return messages;
    }
    return null;
  }



  return (
    <div className="App" style={{padding:20,display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
      <Card className={classes.card}>
        <div style={{width:'100%',justifyContent:'center',alignItems:'center',display:'flex'}}>
          <div style={{width:350}}>
            <CardActionArea>
              <CardMedia
                className={classes.media}
                image={count}
                title="Contemplative Reptile"

              />
     
            </CardActionArea>
          </div>
        </div>
      <div style={{width:'100%'}}>
      <div style={{width:'100%', display:'flex',justifyContent:'center',alignItems:'center'}}> 
      <TextField
          onChange={updateInputValue}
          id="filled-multiline-static"
          label="Post"
          multiline
          rows="4"
          defaultValue="Post text"
          variant="filled"
          style={{maxWidth:500,width:'100%',margin:20}}
        />
        </div>
      <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
      </div>
      </div>
    </Card>
    <form onSubmit={onSubmit} style={{width:'100%',display:'flex',justifyContent:'center',flexDirection:'row', alignItems:'center'}}>
        <div style={{maxWidth:500,width:'100%',display:'flex'}}>
        <input
          id="file"
          type="file"
          ref={fileInput}
          // The onChange should trigger updates whenever
          // the value changes?
          // Try to select a file, then try selecting another one.
          onChange={forceUpdate}
          multiple
        />
        <label htmlFor="file">
          <span tabIndex="0" role="button" aria-controls="filename">
            Upload file(s):{" "}
          </span>
        </label>
        {fileNames()}
        <br />
        <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

export default withFirebase(Create);