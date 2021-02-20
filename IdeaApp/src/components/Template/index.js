import React, { useEffect, useState, useRef} from "react";
import "./template.css";
import { observer } from "mobx-react";

const Template = (props) => {
  const {templateStore} = props;

  useEffect(()=>{
  }, [])

  return (
    <div
      className="template"
    ></div>
  );

}

export default observer(Template);