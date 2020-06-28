import React, { useState, useRef } from 'react';
import { withAuthorization } from '../Session';
import Button from '@material-ui/core/Button';
import { withFirebase } from '../Firebase';
import range from 'lodash/range';
import styled from 'styled-components';
import ItemsCarousel from 'react-items-carousel';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';

import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import DayPicker from 'react-day-picker';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import NavigationIcon from '@material-ui/icons/Navigation';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
  card: {
    maxWidth: 300,
    height:250
  },
  media: {
    height: 150,
    backgroundSize:'contain'
  },
});

function onStartedDownload(id) {
  console.log(`Started downloading: ${id}`);
}

function onFailed(error) {
  console.log(`Download failed: ${error}`);
}




function MediaCard(props) {
  const classes = useStyles();
  let textRef = useRef()
  let formatDate = (date) => {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return monthNames[monthIndex] + ' ' + day + ' ' + year;
  }
  const copyText = () => {
    var copyText = document.getElementById(props.date);
    document.execCommand("Delete");
    copyText.select();
    copyText.setSelectionRange(0, 99999)
    document.execCommand("copy");
    //alert("Copied the text: " + copyText.value);
  }
  return (
    <div>
   
    <Card className={classes.card}>
      {/* <CardActionArea> */}
        <CardMedia
          className={classes.media}
          style={{backgroundImage:`url(${props.image})`,backgroundRepeat:'no-repeat'}}
          
        />
        <CardContent>
    
          <Typography variant="body2" color="textSecondary" component="p">
          <p style={{fontWeight:'bold'}}>{formatDate(new Date(props.date))}</p>
          <div style={{display:'flex', width:'100%'}}><TextField type="text" value={props.text} id={props.date} style={{display:'block', width:'100%'}} ref={textRef} variant="outlined"/></div>
          </Typography>
         
        </CardContent>
      {/* </CardActionArea> */}
      <CardActions>
        <Button size="small" color="primary" onClick={()=>{
          

          let dataUser = props.firebase.database().ref(`user/`);
 
          let dataPending = props.firebase.database().ref(`pending/${props.shortID}`);
          
          document.getElementById(props.shortID).remove();
      
          
          props.firebase.database().ref(`/user/${props.userId}`).once('value').then(function(snapshot) {
            snapshot.forEach((dataSnapShot)=>{
             if(dataSnapShot.val().shortID === props.dataSnapkey) {
              dataUser.child(`${props.userId}/${dataSnapShot.key}`).update({approved:'denied'});
              dataPending.remove()
             }
            })
          }) //move and increment decrement
          
          //dataPending.remove();
          //window.location.reload()
       
       
        }}>
          <p>Deny</p>
        </Button>
        <Button size="small" color="primary" disabled={props.status ? true : false} onClick={()=>{
           let month = ["January", "February", "March", "April", "May", "June",
           "July", "August", "September", "October", "November", "December"];
          var setTime = new Date(props.date);
          var month_ = setTime.getMonth();
          var day_ = setTime.getDate();
          var year = setTime.getFullYear();

            props.firebase.database().ref(`/${month[month_]}/`).once('value').then((snapshot)=> {
            //snapshot.val().day
            let date = snapshot.val();
            if(date !== null) {
            if(date[`${day_}`] == undefined) {
              props.firebase.database().ref(`/${month[month_]}/${day_}`).set({
                day:day_,
                hoursLeftForPromo:24 - props.hoursWanted
              });
            } else {
              
              console.log('d :',date);
              console.log('d :',day_)
              if(Math.sign(date[`${day_}`].hoursLeftForPromo) != -1 ) {
                props.firebase.database().ref(`/${month[month_]}/${day_}`).set(
                  {
                    day:day_,
                    hoursLeftForPromo:date[`${day_}`].hoursLeftForPromo - props.hoursWanted
                  }
                ).then(()=>{

                 
                });
              } else {

              }
            }   
          }


          });

         
         
          let dataPending = props.firebase.database().ref(`pending/`);
          //dataPending.remove();
          //document.getElementById(props.shortID).remove()
          //dataUser.remove();
          dataPending.child(`${props.shortID}`).update({approved:true});
          let dataUser = props.firebase.database().ref(`user/`);
          props.firebase.database().ref(`/user/${props.userId}`).once('value').then(function(snapshot) {
            snapshot.forEach((dataSnapShot)=>{
             if(dataSnapShot.val().shortID === props.dataSnapkey) {
              dataUser.child(`${props.userId}/${dataSnapShot.key}`).update({approved:true});
              
             }
            })
          }).then(()=>{
            props.firebase.database().ref(`/${month[month_]}/`).once('value').then((snapshot)=> {
              //snapshot.val().day
              if(snapshot.val() == null) {
                props.firebase.database().ref(`/${month[month_]}/${day_}`).set({
                  day:day_,
                  hoursLeftForPromo:24 - props.hoursWanted
                });
              } else {
                let date = snapshot.val();
                if(date[`${day_}`].hoursLeftForPromo != 0) {
                  props.firebase.database().ref(`/${month[month_]}/${day_}`).set(
                    {
                      day:day_,
                      hoursLeftForPromo:date[`${day_}`].hoursLeftForPromo - props.hoursWanted
                    }
                  );
                }
              }
            });

          })

          //window.location.reload()
        }}>
          Approve
        </Button>
        {/* <Button size="small" color="primary">
          Learn More
        </Button> */}
        <div style={{display:'flex', flexDirection:'column'}}>
  <Button onClick={()=>{copyText()}} size="small" style={{marginBottom:10}}>Copy Text</Button>
  <Button onClick={()=>{
  let a = document.createElement('a')
  a.href = props.image
  a.download = props.image.split('/').pop()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}} size="small" >Download</Button>
  </div>
      </CardActions>
    </Card>
    <div style={{margin:10}}>Status: {(()=>{
    if(props.status === false) {
      return 'Awaiting approval...'
    } else if (props.status === true) {
      return 'Approved!'
    } else if(props.status === 'denied') {
      return 'Denied!'
    }
  })()}</div>
  
    </div>
  );
}


let mylist = [];
let items = false;
const Home = (props) => {
  const [list, setCount] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const chevronWidth = 40;
  const load = () => {
    if(items == false) {
      var userId = props.firebase.auth.currentUser.uid;
      props.firebase.database().ref('/pending').once('value').then(function(snapshot) {
        snapshot.forEach((dataSnapShot)=>{
          console.log('data',dataSnapShot)
          mylist.push(<div id={dataSnapShot.val().shortID} style={{width:300,border:'0px solid black',padding:10}}><MCard text={dataSnapShot.val().text.text} date={dataSnapShot.val().date} status={dataSnapShot.val().approved} image={dataSnapShot.val().url} shortID={dataSnapShot.val().shortID} dataSnapkey={dataSnapShot.key} hoursWanted={dataSnapShot.val().hours} userId={dataSnapShot.val().userId}/></div>)
        })
        setCount(mylist)
        mylist = []
      });
      items = true;
    }

  }
 return( <div style={{display:'flex',justifyContent:'center', flexDirection:'column'}}>
    <div style={{maxWidth:800, width:'100%', display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
    <h1>Admin</h1>
    {/* <div style={{margin:'10px 0px'}}>
    <Button href="/account" variant="contained" color="primary" disableElevation>
      PROFILE
    </Button>
    </div> */}
  
    {/* <div style={{margin:'10px 0px'}}>
    <Button href="/schedule" variant="contained" color="primary" disableElevation>
      Schedule Promo
    </Button>
    </div> */}
{/* <div>
<DayPicker
           
            initialMonth={new Date()}
          
            
          />
            <p>
            {this.state.selectedDay
            ? this.state.string
            : 'Please select a day 👻'}</p>
    </div> */}
    
    <div style={{height:'100%',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div style={{width:400,height:300}}>
        {/* <h1>My Promos</h1> */}
       {load()}
    
       <div style={{ padding: `0 ${chevronWidth}px 40px`, width:320}}>
      <ItemsCarousel
        requestToChangeActive={setActiveItemIndex}
        activeItemIndex={activeItemIndex}
        numberOfCards={1}
        gutter={10}
        leftChevron={<Fab color="secondary" aria-label="edit">
        <p style={{fontSize:14}}>{'<'}</p>
      </Fab>}
        rightChevron={<Fab color="secondary" aria-label="edit">
        <p style={{fontSize:14}}>{'>'}</p>
      </Fab>}
        outsideChevron
        chevronWidth={chevronWidth}
      >
{list}
      </ItemsCarousel>
    </div>

      </div>
          
    </div>
    </div>
    <div style={{height:'65px',
    width:'100%',
    background:'rgb(243, 90, 238)',
    /* position: absolute; */
    position:'absolute',
    bottom: 0}}>

    </div>
    <div>
    
    </div>
    {/* <div style={{display:'flex', flexDirection:'column', position:'absolute'}}>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    <div style={{height:20}}></div>
    <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </div> */}
  </div>
  
  ) 
};
const HomeMain = withFirebase(Home);
const MCard = withFirebase(MediaCard);
const condition = (authUser) =>  {
  if(authUser != null) {
    if(authUser.email === 'admin@schedulewithhannah.com') {
       return true
     } else {
     
     }
  }
};
export default withAuthorization(condition)(HomeMain);

