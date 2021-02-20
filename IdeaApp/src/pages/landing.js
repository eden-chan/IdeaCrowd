import React from "react";
import { auth } from "../firebase";
import Button from "@material-ui/core/Button";
import Layout from "../components/Layout";
import "react-pro-sidebar/dist/css/styles.css";

const Landing = () => {
  const logout = () => {
    auth.signOut();
  };

  return (
    <div>
      <Layout />
      {/* <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "90vh",
        }}
      >
        <Button variant="contained" color="primary" onClick={logout}>
          Log Out
        </Button>
      </div> */}
    </div>
  );
};

export default Landing;
