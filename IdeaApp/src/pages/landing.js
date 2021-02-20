import React from "react";
import { auth } from "../firebase";
import Button from "@material-ui/core/Button";
import Layout from "../components/Layout";
import {Container, Row, Col, Form } from "react-bootstrap";

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const Landing = () => {
  const classes = useStyles();

  const logout = () => {
    auth.signOut();
  };

  return (
    <>
     <Container fluid>
        <Row>
          <Col xs={2} id="sidebar-wrapper">      
            <Layout />
          </Col>
          <Col xs={10} id="page-content-wrapper">
              <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button variant="contained" color="primary" onClick={logout}>
                Log Out
              </Button>
            </div>
          </Col>  
        </Row>
        <Row>
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
        </Row>
      </Container>
    </>
    );
};

export default Landing;
