
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import bear from "../assets/bear.jpg"

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      pass: ''
    }

    this.handleEmail = this.handleEmail.bind(this);
    this.handlePass = this.handlePass.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleEmail(event) {
    this.setState({email: event.target.value});
  }

  handlePass(event) {
    this.setState({pass: event.target.value});
  }

  handleSubmit(event) {
    auth.signInWithEmailAndPassword(this.state.email, this.state.pass)
      .then((user) => {
        
      })
      .catch((error) => {
        console.log(error);
      });
    event.preventDefault();
  }

  render() {
    const { classes } = this.props;
    return (
      <div style={{backgroundImage: `url(${bear})`, height: '500px'}}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <br/>
        <div className={classes.paper} style={{backgroundColor: 'rgba(255,255,255,0.6)', padding:'25px', borderRadius:'20px'}}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.handleSubmit} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.handleEmail}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handlePass}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link to='/signup'>
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={8}>
        </Box>
      </Container>
      </div>
    );
  }
}

export default withStyles(styles)(SignIn);