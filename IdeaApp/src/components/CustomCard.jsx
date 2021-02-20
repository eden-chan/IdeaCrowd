import React from 'react';
import Button from "@material-ui/core/Button";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { fade, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme, background) => ({
  root: {
    minWidth: 275,
  },
  card: {
    marginBottom: '20px',
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

const CustomCard = (props) => {
  const { title, type, description, background } = props;
  const classes = useStyles();

  return (<Card className={classes.card} style={{backgroundImage: `url(${background})`}}>
    <CardContent>
      <Typography className={classes.title} color="textSecondary" gutterBottom>
        Project 
      </Typography>
      <Typography variant="h5" component="h2">
        {title}
      </Typography>
      <Typography className={classes.pos} color="textSecondary">
        {type}
      </Typography>
      <Typography variant="body2" component="p">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      <Button size="small" className={classes.buttonCard}>Explore</Button>
    </CardActions>
  </Card>);
}

export default CustomCard;