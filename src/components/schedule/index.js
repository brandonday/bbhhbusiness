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
let selection = []

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
    display:'flex',
    justifyContent:'center',
    flexDirection:'column'
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
    this.state = {
      selectedDay: null,
      string:''
    };
  }

  handleDayClick(day, { selected }) {
    this.setState({
      selectedDay: selected ? undefined : day,
    });
    selection.date = day;
    let days = selection.amountOfDays == undefined ? 1: selection.amountOfDays + 1;

    let string = "You have chosen to run a promo on Hanna's: " + `${selection.platform} ` + ` ${selection.date} ` + "for " + `${days}` + `${ days > 1 ? ' consecutive days ' : ' day ' }` + "for the amount of " + `$${selection.price} USD` + ' giving you ' + selection.hours + ' hours of promotion';
    string = string.toString();
    //alert(string)
    this.setState({string})
 
  }

  render() {
    return (
      <div>
        <div style={{display:'flex',flexDirection:'column'}}>
          <DayPicker
            selectedDays={this.state.selectedDay}
            onDayClick={this.handleDayClick}
            modifiers={ { 
              disabled: { daysOfWeek: [0] }, 
            
            }} 
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

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    
    selection.platform = props.platform;
    selection.price = props.price;
    selection.hours = props.hours;
    
  };

  return (
    <div className={classes.root}>
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>{props.hours}</Typography>
          <Typography className={classes.secondaryHeading}>${props.price} USD</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <div style={{display:'flex',justifyContent:'center',flexDirection:'column', alignItems:'center', width:'100%'}}>
            <div>
              <Example />
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
  
  const handleChange = (event, newValue) => {
    setValue(newValue);
    selection.amountOfDays = newValue;
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="One Day" {...a11yProps(0)} />
          <Tab label="Two Days" {...a11yProps(1)} />
          <Tab label="Three Days" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <CardMedia
          style={{objectFit:'contain'}}
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={`${props.image}`}
          title="Contemplative Reptile"
        />
        <div style={{margin:10}}>
          <ControlledExpansionPanels hours={'6'} price={'5.00'} platform={props.platform} style={{margin:10}}/>
        </div>
        <div style={{margin:10}}>
          <ControlledExpansionPanels hours={'12'} price={'10.00'} platform={props.platform} style={{margin:10}}/>
        </div>
        <div style={{margin:10}}>
          <ControlledExpansionPanels hours={'24'} price={'20.00'} platform={props.platform} style={{margin:10}}/>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <CardMedia
        style={{objectFit:'contain'}}
          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={`${props.image}`}
          title="Contemplative Reptile"
        />
      <div style={{margin:10}}>
        <ControlledExpansionPanels hours={'6'} price={'5.00'} platform={props.platform} style={{margin:10}}/>
      </div>
      <div style={{margin:10}}>
        <ControlledExpansionPanels hours={'12'} price={'10.00'} platform={props.platform} style={{margin:10}}/>
      </div>
      <div style={{margin:10}}> 
        <ControlledExpansionPanels hours={'24'} price={'20.00'} platform={props.platform} style={{margin:10}}/>
      </div>
      </TabPanel>
      <TabPanel value={value} index={2}>
      <CardMedia
                style={{objectFit:'contain'}}

          component="img"
          alt="Contemplative Reptile"
          height="140"
          image={`${props.image}`}
          title="Contemplative Reptile"
        />
      <div style={{margin:10}}>
        <ControlledExpansionPanels hours={'6'} price={'5.00'} platform={props.platform} style={{margin:10}}/>
      </div>
      <div style={{margin:10}}>
        <ControlledExpansionPanels hours={'12'} price={'10.00'} platform={props.platform} style={{margin:10}}/>
      </div>
      <div style={{margin:10}}>
        <ControlledExpansionPanels hours={'24'} price={'20.00'} platform={props.platform} style={{margin:10}}/>
      </div>
     </TabPanel>
    </div>
  );
}

export function Schedule(props) {
  const [chosen, setChosen] = React.useState('');
  const classes = useStyles();
  return (
    <div style={{display:'flex',justifyContent:'center'}}>
      <div style={{width:'100%',maxWidth:500}}>
        <Card className={classes.card}>
          <SimpleTabs image={'https://ed-projects.com/wp-content/uploads//instagram.jpg'} platform={'instagram'}/>
          <div style={{display:'flex',width:'100%',justifyContent:'center',padding:'15px 0px'}}>
            <div style={{display:'flex',flexDirection:'column', maxWidth:400, width:'100%'}}>
            <div style={{maxWidth:800, width:'100%'}}>
              {chosen}
            </div>
            <Button onClick={()=>{
          

            }} variant="contained" color="primary">CHOOSE</Button>
            <div>
              
            </div>
            </div>
          </div>
        </Card>
        <div style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center'}}><p>or</p></div>
        <Card className={classes.card}>
          <SimpleTabs image={'https://upload.wikimedia.org/wikipedia/commons/0/0a/OnlyFans_logo_3.jpg'} platform={'onlyfans'}/>
          <div style={{display:'flex',width:'100%',justifyContent:'center'}}>
            <Button variant="contained" color="primary">CHOOSE</Button>
            {chosen}
          </div>
        </Card>
      </div>
    </div>
  )
};

const condition = authUser => !!authUser;
export default withAuthorization(condition)(Schedule);

