import React from "react";
import { auth } from "../firebase";
import Button from "@material-ui/core/Button";
import Layout from "../components/Layout";

import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import Done from '@material-ui/icons/Done';
import Forest from '../assets/forest.jpg';
import Forest1 from '../assets/forest1.jpg';
import Forest2 from '../assets/forest2.png';

import CustomCard from '../components/CustomCard';
import TemporaryDrawer from '../components/TemporaryDrawer';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
  },
  card: {
    marginBottom: '20px',
    backgroundImage: `url(${Forest})`,
    color: 'white'
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    color: 'white'
  },
  pos: {
    marginBottom: 12,
    color: 'white'
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  titles: {
    marginRight: '50%'
  },
  optionButtons: {
    marginTop: '10px',
  },
  buttonCard: {
    color: 'white'
  }
}));

const Landing = () => {
  const classes = useStyles();

  const logout = () => {
    auth.signOut();
  };

  return (
    <div>  
      <Layout />
        <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
      
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Search…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </div>
      <div style={{float: 'right', marginRight: '30px', marginBottom: '20px'}}>
        <Button variant="contained" color="primary" onClick={logout}>
          Log Out
        </Button>
      </div>
    <div style={{marginLeft: '293.2px', marginRight: '30px', marginTop: '60px'}}>
      
      <div className={classes.options}>
        <h1 className={classes.titles}>
          My Projects
        </h1>
        <BottomNavigation
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction label="Ongoing" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Favorite" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Completed" icon={<Done />} />
        </BottomNavigation>
      </div>
      <CustomCard title='Word of the Day' type='Benevolent' description='Meaning friend and kindly.' background={Forest} />
      <CustomCard title='test' type='test' description='test' background={Forest1} />
      <CustomCard title='Make a wish' type='Charity' description='Project focusing on bringing wishes of children with physical or mental disabilities come true.' background={Forest2} />
      <TemporaryDrawer />
    </div>
    </div>
    );
};

export default Landing;
