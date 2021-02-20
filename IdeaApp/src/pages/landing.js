import React from "react";
import { auth } from "../firebase";
import Button from "@material-ui/core/Button";
import Layout from "../components/Layout";
import {Container, Row, Col, Card, Form } from "react-bootstrap";

const Landing = () => {
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
          <Col  xs={10} id="page-content-wrapper">
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
      </Container>
    </>
    );
};

export default Landing;
