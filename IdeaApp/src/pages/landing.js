import React from "react";
import { auth } from "../firebase";
import Button from "@material-ui/core/Button";
import Layout from "../components/Layout";

import { fade, makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 275,
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
  },
  pos: {
    marginBottom: 12,
  },
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
      <div style={{position: "absolute", top: 15, right: 25}}>
        <Button variant="contained" color="primary" onClick={logout}>
          Log Out
        </Button>
      </div>
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
    <div style={{marginLeft: '293.2px'}}>
      <h1>
        My Projects
      </h1>
      <Card className={classes.root}>
        <CardContent>
          <Typography className={classes.title} color="textSecondary" gutterBottom>
            Word of the Day
          </Typography>
          <Typography variant="h5" component="h2">
            test
          </Typography>
          <Typography className={classes.pos} color="textSecondary">
            adjective
          </Typography>
          <Typography variant="body2" component="p">
            well meaning and kindly.
            <br />
            {'"a benevolent smile"'}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions>
      </Card>
    </div>
    </div>
    );
};

export default Landing;
