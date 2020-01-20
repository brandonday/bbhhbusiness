import React, { useState } from 'react';
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

function MediaCard(props) {
  const classes = useStyles();
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
  return (
    <div>
    <Card className={classes.card}>
      <CardActionArea>
        <CardMedia
          className={classes.media}
          style={{backgroundImage:`url(${props.image})`,backgroundRepeat:'no-repeat'}}
          
        />
        <CardContent>
    
          <Typography variant="body2" color="textSecondary" component="p">
          <p style={{fontWeight:'bold'}}>{formatDate(new Date(props.date))}</p>
          <p>{props.text}</p>
          </Typography>
        </CardContent>
      </CardActionArea>
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
              if(date[`${day_}`].hoursLeftForPromo != 0 ) {
                props.firebase.database().ref(`/${month[month_]}/${day_}`).set(
                  {
                    day:day_,
                    hoursLeftForPromo:date[`${day_}`].hoursLeftForPromo - props.hoursWanted
                  }
                ).then(()=>{

                 
                });
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
          })
   
    
          //window.location.reload()
        }}>
          Approve
        </Button>
        {/* <Button size="small" color="primary">
          Learn More
        </Button> */}

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
          mylist.push(<div id={dataSnapShot.val().shortID} style={{width:300,border:'0px solid black',padding:10}}><MCard text={'post text post text post text post text post text post text post text post text post text post text post text post text post text post text post text'} date={dataSnapShot.val().date} status={dataSnapShot.val().approved} image={dataSnapShot.val().url} shortID={dataSnapShot.val().shortID} dataSnapkey={dataSnapShot.key} hoursWanted={dataSnapShot.val().hours} userId={dataSnapShot.val().userId}/></div>)
        })
        setCount(mylist)
        mylist = []
      });
      items = true;
    }

  }
 return( <div style={{display:'flex',justifyContent:'center'}}>
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
  </div>) 
};
const HomeMain = withFirebase(Home);
const MCard = withFirebase(MediaCard);
const condition = authUser => !!authUser;
export default withAuthorization(condition)(HomeMain);

