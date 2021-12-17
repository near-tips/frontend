import React from 'react';
import ReactLoader from "react-loader-spinner";

import variables from 'styles/variables.module.scss';

const Loader = ({ className }) => {
  return <ReactLoader
    className={className}
    type="BallTriangle"
    color={variables['$button-color']}
    height={80}
    width={80}
  />;
};

export default Loader;
