import React from 'react';
import PropTypes from 'prop-types';

function TestC(props) {
  console.log(props);

  const { h } = props;
  return (
    <>
      <p>TestC:</p>
      {h}
    </>
  );
}

TestC.propTypes = {
  h: PropTypes.string,
};

export default TestC;
