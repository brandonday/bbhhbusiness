import React from 'react';
import { withAuthorization } from '../Session';
import Button from '@material-ui/core/Button';

const Home = () => (
  <div style={{display:'flex',justifyContent:'center'}}>
    <div style={{maxWidth:800, width:'100%', display:'flex', flexDirection:'column'}}>
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
  </div>
);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(Home);

