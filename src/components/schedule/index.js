import React from 'react';
import { withAuthorization } from '../Session';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';


import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';

import CardMedia from '@material-ui/core/CardMedia';

import { withFirebase } from '../Firebase';

import * as ROUTES from '../../constants/routes';

import Hashids from 'hashids'
import { DeviceBatteryCharging20 } from 'material-ui/svg-icons';
const hashids = new Hashids()

let selection = {}
let monthArr = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
let isAvail = true;
let dayC = ''
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


const useStylesExpand = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column'
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
}));

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
}));

export class Example extends React.Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.handleDate = this.handleDate.bind(this);
    this.state = {
      selectedDay: null,
      string: '',
      full: '',
      isAvail: true,
      disable: []
    };
  }
  componentDidMount() {
    let month = new Date().getMonth();
    this.handleDate(monthArr[month])

  }

  handleDayClick(day, { selected }) {
    this.setState({
      selectedDay: selected ? day : day,
    });

    var todayTime = new Date(day);
    var month_ = todayTime.getMonth();
    var day_ = todayTime.getDate();
    var year = todayTime.getFullYear();
    let ok = true;


    this.props.firebase.database().ref(`/${monthArr[month_]}/`).once('value').then((snapshot) => {
      //snapshot.val().day
      // alert(day_)
      if (snapshot.val() != null) {
        snapshot.forEach((DataSnapshot) => {
          console.log('data', DataSnapshot.val().hoursLeftForPromo)

          if (DataSnapshot.key == day_) {
            if (Math.sign(DataSnapshot.val().hoursLeftForPromo - selection.hours) === -1) {
              let string = "Sorry, this date or amount of hours chosen is no longer available. Please select another";
              this.setState({ string });
              isAvail = false;
            }
          }


        })


      }
    });

    isAvail = true;


    selection.date = day;
    let days = dayC;

    let string = "You have chosen to run a promo on Hannah's: " + `${selection.platform} ` + ` ${selection.date} ` + "for " + `${days}` + `${days > 1 ? ' consecutive days ' : ' day '}` + "for the amount of " + `$${selection.price} USD` + ' giving you ' + selection.hours + ' hours of promotion';
    string = string.toString();
    //alert(string)
    this.setState({ string });
    localStorage.setItem("schedule", JSON.stringify({ month: `${monthArr[month_]}`, platform: selection.platform, date: selection.date, days: days, price: selection.price, hours: selection.hours, day: day }))


  }
  handleDate(month) {
    console.log(month);
    //let doc = JSON.parse(localStorage.getItem("days") !== null ? localStorage.getItem("days"): '')
    //console.log(doc)
    // alert(dayC)
    let full;
    let disable = [];
    let day_arr = []
    let counter;
    let schedule =
      this.props.firebase.database().ref(`/${month}/`).once('value').then((snapshot) => {
        //snapshot.val().day
        if (snapshot.val() != null) {
          snapshot.forEach((DataSnapshot) => {
            console.log('hoursLeft', DataSnapshot.val().hoursLeftForPromo)
            console.log('hours', selection.hours)

            if (Math.sign(DataSnapshot.val().hoursLeftForPromo - selection.hours) === -1) {
              console.log('datasnapshot ', DataSnapshot.key, 'year ', new Date().getFullYear());
              full = `${new Date().getMonth() + 1}-${DataSnapshot.key}-${new Date().getFullYear()}`;
              console.log('date', full)
              disable.push(new Date(full))
            }
            let hours = DataSnapshot.val().hoursLeftForPromo - selection.hours;
            if (!isNaN(hours)) { //if theres an actual number meaning dates arent undefined 
              if (counter < 2) { //duration based on selected days tab
                if (Math.sign(DataSnapshot.val().hoursLeftForPromo - selection.hours) === -1) { //if the desired selection of hours minus hours left are 0 or less
                  disable.push(new Date(full)); //then disable that date or dates
                } else {
                  day_arr.push(new Date(full)); //if only one date has hours left 0 or less then a push here
                }
                counter++;
              } else if (counter >= 2) { //once we've received the 2 day check
                if (disable != []) { //if the disable array is not empty, meaning at least one date, 
                  for (let i = 0; i < day_arr.length; i++) {
                    disable.push(day_arr[i]) //then iterate over the day_arr which contains the other day even though it wasn't disabled. Since we need consistency if 1 of 2 is disabled then both are
                  }
                } disable = [];
                day_arr = [];
              }

            }



          })

          this.setState({ disable: disable })

        }
      });

  }

  render() {
    return (
      <div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <DayPicker
            selectedDays={this.state.selectedDay}
            onDayClick={this.handleDayClick}
            disabledDays={this.state.disable}
            initialMonth={new Date()}
            onMonthChange={this.handleDate()}

          />
          <p>
            {this.state.selectedDay
              ? this.state.string
              : 'Please select a day 👻'}
          </p>
        </div>
      </div>
    );

  }
}

export function ControlledExpansionPanels(props) {
  const classes = useStylesExpand();
  const [expanded, setExpanded] = React.useState(false);
  const [panel, setPanel] = React.useState()
  const handleChange = panel => (event, isExpanded) => {
    if (panel === props.panel) {
      document.getElementById('hours').click();

      setExpanded(isExpanded);
      setPanel(props.panel)
      selection.platform = props.platform;
      selection.price = props.price;
      selection.hours = props.hours;
    }

  };
  const hours = (panel) => {

    selection.platform = props.platform;
    selection.price = props.price;
    selection.hours = panel;

  }

  return (
    <div className={classes.root}>

      <ExpansionPanel expanded={expanded} id={'hours'} onChange={handleChange(props.panel)} onClick={() => { hours(props.hours) }} >
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{props.hours} hours</Typography>
          <Typography className={classes.secondaryHeading}>${props.price} USD</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <div>
              <Basic />
            </div>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}


export function SimpleTabs(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [expanded, setExpanded] = React.useState(false);
  const [amountOfDays, setamountOfDays] = React.useState(0);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (panel === 'panelI1') {

      selection.price = '5.00 USD';
      selection.hours = 6;
      selection.amountOfDays = value
      selection.platform = 'Instagram'
    } else if (panel === 'panelI2') {

      selection.price = '10.00 USD';
      selection.hours = 12;
      selection.amountOfDays = value
      selection.platform = 'Instagram'


    } else if (panel === 'panelI3') {

      selection.price = '20.00 USD';
      selection.hours = 24;
      selection.amountOfDays = value
      selection.platform = 'Instagram'


    }
  };
  const handleChangeTab = (event, newValue) => {
    setValue(newValue);

  };
  const hours = (panel) => {

    if (panel === 'panelI1') {

      selection.price = '5.00 USD';
      selection.hours = 6;
      selection.amountOfDays = value
      selection.platform = 'Instagram'


    } else if (panel === 'panelI2') {

      selection.price = '10.00 USD';
      selection.hours = 12;
      selection.amountOfDays = value
      selection.platform = 'Instagram'


    } else if (panel === 'panelI3') {

      selection.price = '20.00 USD';
      selection.hours = 24;
      selection.amountOfDays = value
      selection.platform = 'Instagram'


    }
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChangeTab} aria-label="simple tabs example">
          <Tab label="One Day" id="one" {...a11yProps(0)} onClick={() => { dayC = 1 }} />
          <Tab label="Two Days" id="two" {...a11yProps(1)} onClick={() => { dayC = 2 }} />
          <Tab label="Three Days" id="three" {...a11yProps(2)} onClick={() => { dayC = 3 }} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <CardMedia
          style={{ objectFit: 'contain' }}
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={`${props.image}`}
          title="Contemplative Reptile"
        />
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'6'} price={'5.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI1'} id={'hours'} onChange={handleChange('panelI1')} onClick={() => { hours('panel1') }} >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>{props.hours}6 hours</Typography>
              <Typography className={classes.secondaryHeading}>$5.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'12'} price={'10.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI2'} id={'hours'} onChange={handleChange('panelI2')}  >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>12 hours</Typography>
              <Typography className={classes.secondaryHeading}>$10.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'24'} price={'20.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI3'} id={'hours'} onChange={handleChange('panelI3')}  >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>24 hours</Typography>
              <Typography className={classes.secondaryHeading}>$20.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <CardMedia
          style={{ objectFit: 'contain' }}
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={`${props.image}`}
          title="Contemplative Reptile"
        />
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'6'} price={'5.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI1'} id={'hours'} onChange={handleChange('panelI1')} onClick={() => { hours('panel1') }} >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>{props.hours}6 hours</Typography>
              <Typography className={classes.secondaryHeading}>$5.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'12'} price={'10.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI2'} id={'hours'} onChange={handleChange('panelI2')}  >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>12 hours</Typography>
              <Typography className={classes.secondaryHeading}>$10.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'24'} price={'20.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI3'} id={'hours'} onChange={handleChange('panelI3')}  >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>24 hours</Typography>
              <Typography className={classes.secondaryHeading}>$20.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CardMedia
          style={{ objectFit: 'contain' }}
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={`${props.image}`}
          title="Contemplative Reptile"
        />
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'6'} price={'5.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI1'} id={'hours'} onChange={handleChange('panelI1')} onClick={() => { hours('panel1') }} >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>{props.hours}6 hours</Typography>
              <Typography className={classes.secondaryHeading}>$5.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'12'} price={'10.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI2'} id={'hours'} onChange={handleChange('panelI2')}  >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>12 hours</Typography>
              <Typography className={classes.secondaryHeading}>$10.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
        <div style={{ margin: 10 }}>
          {/* <ControlledExpansionPanels hours={'24'} price={'20.00'} platform={props.platform} style={{margin:10}}/> */}
          <ExpansionPanel expanded={expanded === 'panelI3'} id={'hours'} onChange={handleChange('panelI3')}  >
            <ExpansionPanelSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography className={classes.heading}>24 hours</Typography>
              <Typography className={classes.secondaryHeading}>$20.00 USD</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <div>
                  <Basic />
                </div>
              </div>
            </ExpansionPanelDetails>
          </ExpansionPanel>
        </div>
      </TabPanel>
    </div>
  );
}

export function Schedule(props) {
  const [chosen, setChosen] = React.useState('');
  const classes = useStyles();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 50px' }}>
      <div style={{ width: '100%', maxWidth: 500 }}>
        <Card className={classes.card}>
          <SimpleTabs image={'https://ed-projects.com/wp-content/uploads//instagram.jpg'} platform={'instagram'} />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '15px 0px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 330, width: '100%' }}>
              <div style={{ maxWidth: 800, width: '100%' }}>
                {chosen}
              </div>
              <Button onClick={() => {
                if (isAvail === true) {
                  localStorage.setItem("promoInfo", JSON.stringify({}))
                  window.location.replace('/payment');
                }
              }} variant="contained" color="primary">CHOOSE</Button>
              <div>

              </div>
            </div>
          </div>
        </Card>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h1>or</h1></div>

        <Card className={classes.card}>
          <SimpleTabs image={'https://upload.wikimedia.org/wikipedia/commons/0/0a/OnlyFans_logo_3.jpg'} platform={'onlyfans'} />
          <div style={{ display: 'flex', width: '100%', justifyContent: 'center', padding: '15px 0px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 330, width: '100%' }}>
              <div style={{ maxWidth: 800, width: '100%' }}>
                {chosen}
              </div>
              <Button onClick={() => {
                localStorage.setItem("promoInfo", JSON.stringify({}))
                window.location.replace('/payment');

              }} variant="contained" color="primary">CHOOSE</Button>
              <div>

              </div>
            </div>
          </div>
        </Card>

      </div>
    </div>
  )
};

const Basic = withFirebase(Example);

const condition = authUser => !!authUser;
export default withAuthorization(condition)(Schedule);

