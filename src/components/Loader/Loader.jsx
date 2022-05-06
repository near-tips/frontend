import React from 'react';
import ReactLoader from "react-loader-spinner";

import variables from 'styles/variables.module.scss';

const Loader = ({ className }) => {
  return <ReactLoader
    className={className}
    type="BallTriangle"
    color={variables['$button-color']}
    height={55}
    width={55}
  />;
};

export default Loader;
