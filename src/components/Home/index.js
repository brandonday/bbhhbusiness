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
            {props.text}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="white" onClick={()=>{
          
          let userId = props.firebase.auth.currentUser.uid;

          let dataUser = props.firebase.database().ref(`user/${userId}/${props.dataSnapkey}`);
 
          let dataPending = props.firebase.database().ref(`pending/${props.shortID}`);
          
          document.getElementById(props.shortID).remove()
          dataUser.remove();
          dataPending.remove();
          window.location.reload()
          // var userId = props.firebase.auth.currentUser.uid;
          // props.firebase.database().ref('/user/' + userId).once('value').then(function(snapshot) {
          //   snapshot.forEach((dataSnapShot)=>{

          //   })
          // })
       
        }}>
          Remove
        </Button>
        {/* <Button size="small" color="primary">
          Learn More
        </Button> */}

      </CardActions>
    </Card>
    <div style={{margin:10}}>Status: {!props.status ? 'Awaiting approval...' : 'Approved!'}</div>
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
      props.firebase.database().ref('/user/' + userId).once('value').then(function(snapshot) {
        snapshot.forEach((dataSnapShot)=>{
          mylist.push(<div id={dataSnapShot.val().shortID} style={{height:300,width:300,border:'0px solid black',padding:10}}><MCard text={dataSnapShot.val().date} status={dataSnapShot.val().approved} image={dataSnapShot.val().url} shortID={dataSnapShot.val().shortID} dataSnapkey={dataSnapShot.key}/></div>)
        })
        setCount(mylist)
        mylist = []
      });
      items = true;
    }

  }
 return( <div style={{display:'flex',justifyContent:'center'}}>
    <div style={{maxWidth:800, width:'100%', display:'flex', flexDirection:'column'}}>
    <div style={{display:'flex',flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
      <h1>Profile Info</h1>
      <div style={{margin:'10px 0px'}}>
        <Button href="/account" variant="contained" color="primary" disableElevation>
          PROFILE
        </Button>
        </div>
  
      <div style={{margin:'10px 0px'}}>
      <Button href="/schedule" variant="contained" color="primary" disableElevation>
        Schedule Promo
      </Button>
      </div>
   </div>
    <div style={{height:'100%',width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div style={{width:400,height:300}}>
        <h1>My Promos</h1>
       {load()}
    
       <div style={{ padding: `0 ${chevronWidth}px 40px`, width:320}}>
      <ItemsCarousel
        requestToChangeActive={setActiveItemIndex}
        activeItemIndex={activeItemIndex}
        numberOfCards={1}
        gutter={10}
        leftChevron={<button>{'<'}</button>}
        rightChevron={<button>{'>'}</button>}
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

